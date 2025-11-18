const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// -------------------- TASK ROUTES -------------------- //

// Create task
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  taskController.createTask
);

// Get all tasks
router.get("/", authMiddleware, taskController.getAllTasks);

// Bulk delete
router.delete("/bulk", authMiddleware, taskController.deleteTasksBulk);

// -------------------- SUBTASK ROUTES (DAHA SPESİFİK) -------------------- //

// Create subtask for a task
router.post("/:taskId/subtasks", authMiddleware, taskController.createSubTask);

// Get subtasks of a task
router.get("/:taskId/subtasks", authMiddleware, taskController.getSubtasks);

// Bulk update
router.put(
  "/subtasks/bulk-status",
  authMiddleware,
  taskController.updateSubtasksStatus
);
router.delete(
  "/subtasks/bulk",
  authMiddleware,
  taskController.deleteSubtasksBulk
);

// Update subtask
router.put("/subtasks/:id", authMiddleware, taskController.updateSubTask);

// Toggle completed
router.patch(
  "/subtasks/:id/status",
  authMiddleware,
  taskController.updateSubTaskStatus
);

// Delete subtask
router.delete("/subtasks/:id", authMiddleware, taskController.deleteSubTask);

// -------------------- SINGLE TASK ROUTES (GENEL) -------------------- //

router.get("/:id", authMiddleware, taskController.getTaskById);

router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  taskController.updateTask
);

router.delete("/:id", authMiddleware, taskController.deleteTask);

// Status & priority
router.put("/status/:id", authMiddleware, taskController.changeTaskStatus);
router.put("/priority/:id", authMiddleware, taskController.changePriority);

module.exports = router;
