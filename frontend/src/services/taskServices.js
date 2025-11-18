// taskApi.js
import api from "../api/api";

// ----------------------------
// Create Task (Çoklu görsel)
// ----------------------------
export const createTask = async (formData) => {
  try {
    const response = await api.post("/tasks", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create task error:", error.response?.data || error.message);
    throw error;
  }
};

// ----------------------------
// Get all tasks
// ----------------------------
export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Get tasks error:", error.response?.data || error.message);
    throw error;
  }
};

// ----------------------------
// Get task by ID
// ----------------------------
export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get task by id error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------------------
// Update task
// ----------------------------
export const updateTask = async ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  tags,
  images,
  removeImageIds,
}) => {
  try {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (status) formData.append("status", status);
    if (priority) formData.append("priority", priority);
    if (dueDate) formData.append("dueDate", new Date(dueDate).toISOString());
    if (tags) formData.append("tags", JSON.stringify(tags));
    if (removeImageIds)
      formData.append("removeImageIds", JSON.stringify(removeImageIds));

    images.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.put(`/tasks/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Update task error:", error.response?.data || error.message);
    throw error;
  }
};

// ----------------------------
// Delete task
// ----------------------------
export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete task error:", error.response?.data || error.message);
    throw error;
  }
};

// ----------------------------
// Delete tasks bulk
// ----------------------------
export const deleteTasksBulk = async (selectedTasks) => {
  try {
    const response = await api.delete("/tasks/bulk", {
      data: { ids: selectedTasks },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Delete tasks bulk error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------------------
// Change task status
// ----------------------------
export const changeTaskStatus = async (id, status) => {
  try {
    const response = await api.put(`/tasks/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(
      "Change task status error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------------------
// Change priority
// ----------------------------
export const changePriority = async (id, priority) => {
  try {
    const response = await api.put(`/tasks/priority/${id}`, { priority });
    return response.data;
  } catch (error) {
    console.error(
      "Change task priority error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ============================================================
//                   SUBTASK API (NEW)
// ============================================================

// ----------------------------
// Create Subtask
// ----------------------------
export const createSubTask = async (taskId, title) => {
  try {
    const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return response.data;
  } catch (error) {
    console.error(
      "Create subtask error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------------------
// Update Subtask
// ----------------------------
export const updateSubTask = async (id, title) => {
  try {
    const response = await api.put(`/tasks/subtasks/${id}`, { title });
    return response.data;
  } catch (error) {
    console.error(
      "Update subtask error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------------------
// Toggle Subtask
// ----------------------------
export const updateSubTaskStatus = async (id, isDone) => {
  try {
    const response = await api.patch(`/tasks/subtasks/${id}/status`, {
      isDone,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Update subtask status error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------------------
// Delete Subtask
// ----------------------------
export const deleteSubTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/subtasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Delete subtask error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// getSubtasks
export const getSubtasks = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}/subtasks`);
    return response.data;
  } catch (error) {
    console.error("Get subtasks error:", error.response?.data || error.message);
    throw error;
  }
};

export const bulkDeleteSubtasks = async (subtaskIds) => {
  if (!Array.isArray(subtaskIds) || subtaskIds.length === 0)
    throw new Error("No subtask IDs selected for deletion");

  const response = await api.delete("/tasks/subtasks/bulk", {
    data: { ids: subtaskIds },
  });
  return response.data;
};

export const bulkUpdateSubtasks = async (subtaskIds, isDone) => {
  if (!Array.isArray(subtaskIds) || subtaskIds.length === 0)
    throw new Error("No subtask IDs selected for status update");

  const response = await api.put("/tasks/subtasks/bulk-status", {
    ids: subtaskIds, // <- burada ids olmalı
    isDone: Boolean(isDone),
  });

  return response.data;
};
