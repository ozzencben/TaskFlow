import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import Loader from "../../../../components/loader/Loader";
import LanguageContext from "../../../../context/language/LanguageContext";
import {
  bulkDeleteSubtasks,
  bulkUpdateSubtasks,
  changePriority,
  changeTaskStatus,
  createSubTask,
  deleteSubTask,
  deleteTask,
  getSubtasks,
  getTasks,
  updateSubTaskStatus,
} from "../../../../services/taskServices";
import formattedDate from "../../../../utils/formattedDate";
import TaskItem from "../TaskItem/TaskItem";
import "./TaskList.css";

const TaskList = () => {
  const { t } = useContext(LanguageContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState(null); // Parent'da tutuyoruz
  const [dragCounterMap, setDragCounterMap] = useState({});
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [taskDetail, setTaskDetail] = useState(null);

  const groupedTasks = tasks.reduce(
    (acc, task) => {
      const status = task.status || "TODO";
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    },
    { TODO: [], IN_PROGRESS: [], DONE: [] }
  );

  const handleChangeStatus = async (id, status) => {
    try {
      await changeTaskStatus(id, status);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePriorty = async (id, priority) => {
    try {
      await changePriority(id, priority);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, priority } : task))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSelect = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await getTasks();
        setTasks(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="task-list-container">
      {Object.keys(groupedTasks).map((status) => (
        <div
          className={`task-status-group ${
            dragCounterMap[status] > 0 ? "drag-over" : ""
          }`}
          key={status}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragCounterMap((prev) => ({
              ...prev,
              [status]: (prev[status] || 0) + 1,
            }));
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragCounterMap((prev) => ({
              ...prev,
              [status]: prev[status] > 0 ? prev[status] - 1 : 0,
            }));
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const taskId = e.dataTransfer.getData("taskId");
            handleChangeStatus(taskId, status);
            setDragCounterMap((prev) => ({ ...prev, [status]: 0 }));
            setDraggingTaskId(null);
          }}
        >
          <div className="task-status-group__header">
            <div className="task-status-group__title-container">
              <h2 className="task-status-group__title">
                {t(`tasksControl.${status}`)}
              </h2>
              <div className="task-status-group__count">
                <span className="task-status-group__count-number">
                  {groupedTasks[status].length}
                </span>
              </div>
            </div>
          </div>

          {groupedTasks[status].length > 0 ? (
            groupedTasks[status].map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                selectedTaskIds={selectedTaskIds}
                onToggleSelect={toggleSelect}
                draggingTaskId={draggingTaskId}
                setDraggingTaskId={setDraggingTaskId}
                t={t}
                onClick={() => setTaskDetail(task)}
                onChangeStatus={handleChangeStatus}
                onChangePriority={handleChangePriorty}
                onDeleteTask={handleDeleteTask}
              />
            ))
          ) : (
            <div className="task-status-group__empty">
              <span className="task-status-group__empty-text">
                {t("tasksControl.noTasks")}
              </span>
            </div>
          )}
        </div>
      ))}

      <TaskDetail
        t={t}
        taskDetail={taskDetail}
        onClose={() => setTaskDetail(null)}
        tasks={tasks}
      />
    </div>
  );
};

const TaskDetail = ({ taskDetail, onClose, t }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskIds, setSubtaskIds] = useState([]);
  const [addedSubtask, setAddedSubtask] = useState("");
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(null);
  const [headerOptionsMenuOpen, setHeaderOptionsMenuOpen] = useState(false);

  const toggleHeaderOptionsMenu = () => {
    setHeaderOptionsMenuOpen((prev) => !prev);
  };

  const toggleOptionsMenu = (subtaskId) => {
    setOptionsMenuOpen((prev) => (prev === subtaskId ? null : subtaskId));
  };

  const toggleSelectSubtask = (subtaskId) => {
    setSubtaskIds((prev) =>
      prev.includes(subtaskId)
        ? prev.filter((id) => id !== subtaskId)
        : [...prev, subtaskId]
    );
  };

  // Her zaman çalışmalı, koşulun içinde olmamalı
  const fetchSubtasks = useCallback(async () => {
    if (!taskDetail) return;
    try {
      const res = await getSubtasks(taskDetail.id);
      setSubtasks(res);
    } catch (err) {
      console.error(err);
    }
  }, [taskDetail]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubtasks();
  }, [taskDetail, fetchSubtasks]);

  const handleCreateSubtask = async (taskId, title) => {
    try {
      const res = await createSubTask(taskId, title);
      setSubtasks((prev) => [...prev, res]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubTask(subtaskId);
      setSubtasks((prev) => prev.filter((subtask) => subtask.id !== subtaskId));
      toast.success(t("tasks.subTaskDeleted"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSubtaskStatus = async (subtask) => {
    try {
      const isDone = !subtask.isDone;
      await updateSubTaskStatus(subtask.id, isDone);
      await fetchSubtasks();
      toast.success(t("tasks.subTaskStatusUpdated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubtasksBulk = async () => {
    if (subtaskIds.length === 0) return;

    try {
      await bulkDeleteSubtasks(subtaskIds); // Backend'e id dizisi gönder
      await fetchSubtasks(); // Listeyi anlık güncelle
      setSubtaskIds([]); // Seçimleri temizle
      toast.success(t("tasks.subTasksDeleted"));
    } catch (err) {
      console.error("Error deleting subtasks in bulk:", err);
      toast.error(t("tasks.errorDeletingSubtasks"));
    }
  };

  const handleUpdateSubtasksStatus = async () => {
    if (subtaskIds.length === 0) return;

    try {
      // Sadece seçilen alt görevleri kontrol et
      const selectedSubtasksObjects = subtasks.filter((subtask) =>
        subtaskIds.includes(subtask.id)
      );

      // Eğer seçilenlerin hepsi tamamlanmışsa false yap, değilse true yap
      const isDone = !selectedSubtasksObjects.every(
        (subtask) => subtask.isDone
      );

      // Backend çağrısı: seçilen alt görevlerin tamamlanma durumunu güncelle
      await bulkUpdateSubtasks(subtaskIds, isDone);

      await fetchSubtasks(); // Listeyi güncelle
      setSubtaskIds([]); // Seçimleri temizle
      toast.success(t("tasks.subTasksStatusUpdated"));
    } catch (err) {
      console.error("Error updating subtasks status in bulk:", err);
      toast.error(t("tasks.errorUpdatingSubtasksStatus"));
    }
  };

  // Eğer detay yoksa direkt return null
  if (!taskDetail) return null;

  const remainingText = formattedDate(taskDetail.dueDate, t);
  let remainingClass = "";

  if (
    remainingText.includes(t("tasks.ago")) ||
    remainingText.includes(t("tasks.yesterday"))
  ) {
    remainingClass = "past";
  } else if (
    remainingText.includes(t("tasks.today")) ||
    remainingText.includes(t("tasks.tomorrow"))
  ) {
    remainingClass = "urgent";
  }

  return (
    <div onClick={onClose} className={`task-detail-modal-container active`}>
      <div
        className="task-detail__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-detail__content-header">
          <h2 className="task-detail__content-title">{taskDetail.title}</h2>

          <div className="task-item-container__container">
            <div className="task-item-container__tags">
              {taskDetail.tags.map((tag, index) => (
                <div key={index} className="task-item-container__tag">
                  <span>{tag}</span>
                </div>
              ))}
            </div>

            <div
              className={`task-item-container__priority ${taskDetail.priority.toLowerCase()}`}
            >
              <span>{t(`tasksControl.${taskDetail.priority}`)}</span>
            </div>

            <p className={`task-item-container__remaining ${remainingClass}`}>
              {remainingText}
            </p>
          </div>
        </div>

        <p className="task-detail__content-description">
          {taskDetail.description}
        </p>

        {taskDetail.images.length > 0 && (
          <TaskDetailImages taskImages={taskDetail.images} t={t} />
        )}

        <div className="task-detail__content-subtasks">
          <div className="task-detail__content-subtasks-header">
            <h4 className="task-detail__content-subtasks-title">
              {t("tasksControl.subtasks")}
            </h4>

            <div className="task-detail__content-subtasks-count">
              <div className="task-detail__content-subtasks-count-box">
                <span className="task-detail__content-subtasks-count-number">
                  {subtaskIds.length}
                </span>
              </div>
              <BsThreeDotsVertical
                onClick={toggleHeaderOptionsMenu}
                className="task-detail__content-subtasks-count-icon"
              />

              <div
                className={`task-detail__content-subtasks-header-options ${
                  headerOptionsMenuOpen ? "active" : ""
                }`}
              >
                <div
                  className="task-detail__content-subtasks-header-option"
                  onClick={() => {
                    handleUpdateSubtasksStatus();
                    setHeaderOptionsMenuOpen(false);
                  }}
                >
                  {t("tasksControl.editSubtask")}
                </div>
                <div
                  className="task-detail__content-subtasks-header-option"
                  onClick={() => {
                    handleDeleteSubtasksBulk();
                    setHeaderOptionsMenuOpen(false);
                  }}
                >
                  {t("tasksControl.deleteSubtask")}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateSubtask(taskDetail.id, addedSubtask);
              setAddedSubtask("");
            }}
            className="create-subtask"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              className="create-subtask__input"
              placeholder={t("tasksControl.addSubtask")}
              value={addedSubtask}
              onChange={(e) => setAddedSubtask(e.target.value)}
            />
            <button type="submit" className="create-subtask__button">
              {t("tasksControl.addSubtask")}
            </button>
          </form>

          {subtasks.length > 0 ? (
            <div className="task-detail__content-subtask-list">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="subtask-item-container">
                  <div
                    className={[
                      "subtask-item__checkbox",
                      subtaskIds.includes(subtask.id) ? "checked" : "",
                      subtask.isDone ? "done" : "",
                    ].join(" ")}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectSubtask(subtask.id);
                    }}
                  >
                    {subtask.isDone ? (
                      <IoCheckmarkDoneOutline className="check-icon" />
                    ) : null}
                  </div>

                  <div
                    className={`subtask-item ${subtask.isDone ? "done" : ""}`}
                  >
                    <span
                      className={`subtask-item__title ${
                        subtask.isDone ? "done" : ""
                      }`}
                    >
                      {subtask.title}
                    </span>

                    <BsThreeDotsVertical
                      className={`subtask-item__icon ${
                        subtask.isDone ? "done" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOptionsMenu(subtask.id);
                      }}
                    />

                    <div
                      className={`subtask-item__options ${
                        optionsMenuOpen === subtask.id ? "open" : ""
                      }`}
                    >
                      <span
                        className="subtask-item__options-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubtask(subtask.id);
                          setOptionsMenuOpen(null);
                        }}
                      >
                        {t("tasksControl.deleteSubtask")}
                      </span>

                      {subtask.isDone ? null : (
                        <span
                          className="subtask-item__options-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateSubtaskStatus(subtask);
                            setOptionsMenuOpen(null);
                          }}
                        >
                          {t("tasksControl.editSubtask")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="task-detail__content-subtasks-empty">
              {t("tasksControl.noSubtasks")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskDetailImages = ({ taskImages, t }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => setSelectedImage(image);

  return (
    <div className="task-images-section">
      <div className="task-detail__content-title-container">
        <h4 className="task-detail__image-title">{t("tasksControl.images")}</h4>
      </div>
      <div className="image-container">
        {taskImages.map((image) => (
          <div
            key={image.id}
            className="image-item"
            onClick={() => handleImageSelect(image)}
          >
            <img src={image.url} alt={image.name} className="task-image" />
          </div>
        ))}

        <div className={`image-overlay ${selectedImage ? "open" : ""}`}>
          {selectedImage && (
            <div className="image-overlay-container">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="task-image"
                onClick={() => setSelectedImage(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
