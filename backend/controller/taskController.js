// controllers/taskController.js

const prisma = require("../utils/prismaClient");
const { uploadImages, deleteImages } = require("../utils/cloudinary");

// -------------------------
// Create Task
// -------------------------
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const userId = req.user.userId;

    // Enum mapping
    const statusMap = {
      todo: "TODO",
      in_progress: "IN_PROGRESS",
      done: "DONE",
    };

    const priorityMap = {
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
    };

    // files -> req.files (multer ile)
    const files = req.files || [];
    const uploadedImages = await uploadImages(files.map((file) => file.path));

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: statusMap[status?.toLowerCase()] || "TODO",
        priority: priorityMap[priority?.toLowerCase()] || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: tags ? JSON.parse(tags) : [],
        user: { connect: { id: userId } },
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Task creation failed" });
  }
};

// -------------------------
// Get all tasks for logged-in user
// -------------------------
const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { images: true },
      orderBy: { dueDate: "asc" },
    });

    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Fetching tasks failed" });
  }
};

// -------------------------
// Get single task by ID
// -------------------------
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Fetching task failed" });
  }
};

// -------------------------
// Update Task
// -------------------------
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      removeImageIds,
    } = req.body;

    // Convert removeImageIds from string → array
    if (removeImageIds) {
      try {
        removeImageIds = JSON.parse(removeImageIds);
      } catch (err) {
        console.error("Error parsing removeImageIds:", err);
        removeImageIds = [];
      }
    } else {
      removeImageIds = [];
    }

    // Convert tags from string → array
    if (tags) {
      try {
        tags = JSON.parse(tags);
      } catch (err) {
        console.error("Error parsing tags:", err);
        tags = [];
      }
    }

    // Remove old images if requested
    if (removeImageIds.length > 0) {
      await deleteImages(removeImageIds);

      await prisma.taskImage.deleteMany({
        where: { id: { in: removeImageIds } },
      });
    }

    // Add new images if any
    const files = req.files || [];
    let newImages = [];
    if (files.length > 0) {
      const uploadedImages = await uploadImages(files.map((f) => f.path));
      newImages = uploadedImages.map((img) => ({ ...img }));
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags,
        images: { create: newImages },
      },
      include: { images: true },
    });

    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Updating task failed" });
  }
};

// -------------------------
// Delete Task
// -------------------------
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete images from Cloudinary
    const publicIds = task.images.map((img) => img.publicId);
    if (publicIds.length > 0) await deleteImages(publicIds);

    await prisma.taskImage.deleteMany({ where: { taskId: id } });

    await prisma.task.delete({ where: { id } });

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Deleting task failed" });
  }
};

const deleteTasksBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No task IDs provided" });
    }

    const tasks = await prisma.task.findMany({
      where: { id: { in: ids } },
      include: { images: true },
    });

    // Cloudinary silme
    const publicIds = tasks.flatMap((t) => t.images.map((img) => img.publicId));
    if (publicIds.length > 0) await deleteImages(publicIds);

    // DB silme
    await prisma.taskImage.deleteMany({
      where: { taskId: { in: ids } },
    });

    await prisma.task.deleteMany({
      where: { id: { in: ids } },
    });

    return res.json({ message: "Tasks deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Bulk delete failed" });
  }
};

const changeTaskStatus = async (req, res) => {
  try {
    // ID'yi URL parametresinden (req.params) al
    const { id } = req.params;
    // Status'ü istek gövdesinden (req.body) al
    const { status } = req.body;

    // Zorunlu verilerin kontrolü
    if (!id || !status) {
      return res.status(400).json({
        message: "Eksik veri: Görev ID'si veya Durumu eksik.",
      });
    }

    const task = await prisma.task.update({
      where: { id: id }, // Burası artık geçerli URL parametresi id'sini kullanıyor.
      data: { status: status },
    });

    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Updating task failed" });
  }
};

const changePriority = async (req, res) => {
  try {
    const { id } = req.params; // ← id buradan alınmalı!
    const { priority } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { priority: priority.toUpperCase() }, // enum için güvenli
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Updating task failed" });
  }
};

const createSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const subTask = await prisma.subtask.create({
      data: { title, taskId },
    });

    return res.json(subTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Creating subtask failed" });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const subTask = await prisma.subtask.update({
      where: { id },
      data: { title },
    });

    return res.json(subTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Updating subtask failed" });
  }
};

const updateSubTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDone } = req.body; // true/false gönderilecek

    const subTask = await prisma.subtask.findUnique({
      where: { id },
    });

    if (!subTask) return res.status(404).json({ message: "Subtask not found" });

    const updatedSubTask = await prisma.subtask.update({
      where: { id },
      data: { isDone }, // direkt olarak gelen değeri set et
    });

    return res.json(updatedSubTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Updating subtask failed" });
  }
};

// 🔹 Bulk update
const updateSubtasksStatus = async (req, res) => {
  try {
    const { ids, isDone } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No subtask IDs provided" });
    }

    const updatedSubtasks = await prisma.subtask.updateMany({
      where: { id: { in: ids } },
      data: { isDone },
    });

    return res.json({ message: "Subtasks updated", count: updatedSubtasks.count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Updating subtasks failed" });
  }
};


const deleteSubTask = async (req, res) => {
  try {
    const { id } = req.params;

    const subTask = await prisma.subtask.findUnique({
      where: { id },
    });

    if (!subTask) return res.status(404).json({ message: "Subtask not found" });

    await prisma.subtask.delete({
      where: { id },
    });

    return res.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Deleting subtask failed" });
  }
};

// 🔹 Bulk delete
const deleteSubtasksBulk = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No subtask IDs provided" });
    }

    await prisma.subtask.deleteMany({
      where: { id: { in: ids } },
    });

    return res.json({ message: "Subtasks deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Deleting subtasks failed" });
  }
};


const getSubtasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        subtasks: true,
      },
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const subtasks = await prisma.subtask.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });

    return res.json(subtasks);
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  deleteTasksBulk,
  changeTaskStatus,
  changePriority,
  createSubTask,
  updateSubTask,
  updateSubTaskStatus,
  deleteSubTask,
  getSubtasks,
  updateSubtasksStatus,
  deleteSubtasksBulk
};
