import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import formattedDate from "../../../../utils/formattedDate";
import "./TaskItem.css";

const TaskItem = ({
  task,
  draggingTaskId,
  setDraggingTaskId,
  t,
  onClick,
  onChangePriority,
  onDeleteTask,
  onChangeStatus,
}) => {
  const [priorityChangeMenuOpen, setPriorityChangeMenuOpen] = useState(null);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(null);

  const toggleOptionsMenu = (taskId) => {
    setOptionsMenuOpen((prev) => (prev === taskId ? null : taskId));
  };

  const togglePriorityChangeMenu = (taskId) => {
    setPriorityChangeMenuOpen((prev) => (prev === taskId ? null : taskId));
  };

  const priorityOptions = [
    { value: "LOW", label: t("tasks.low") },
    { value: "MEDIUM", label: t("tasks.medium") },
    { value: "HIGH", label: t("tasks.high") },
  ];

  const remainingText = formattedDate(task.dueDate, t);
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

  const statusOptions = [
    { value: "TODO", label: t("tasks.todo") },
    { value: "IN_PROGRESS", label: t("tasks.in_progress") },
    { value: "DONE", label: t("tasks.done") },
  ];

  return (
    <>
      <div
        className={`task-item-container ${
          draggingTaskId === task.id ? "dragging" : ""
        }`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("taskId", task.id);
          setDraggingTaskId(task.id);
        }}
        onDragEnd={() => setDraggingTaskId(null)}
        onClick={onClick}
      >
        <div className="task-item-container__title-container">
          <p className="task-item-container__title">{task.title}</p>
        </div>

        <div className="task-item-container__container">
          <div className="task-item-container__tags">
            {task.tags.map((tag, index) => (
              <div key={index} className="task-item-container__tag">
                <span>{tag}</span>
              </div>
            ))}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePriorityChangeMenu(task.id);
            }}
            className={`task-item-container__priority ${task.priority.toLowerCase()}`}
          >
            <span>{t(`tasksControl.${task.priority}`)}</span>

            <div
              className={`priority-change-menu ${
                priorityChangeMenuOpen === task.id ? "open" : ""
              }`}
            >
              {priorityOptions
                .filter((option) => option.value !== task.priority)
                .map((option, index) => (
                  <span
                    className="priority-change-menu__item"
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangePriority(task.id, option.value);
                      setPriorityChangeMenuOpen(null);
                    }}
                  >
                    {option.label}
                  </span>
                ))}
            </div>
          </div>

          <p className={`task-item-container__remaining ${remainingClass}`}>
            {remainingText}
          </p>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleOptionsMenu(task.id);
          }}
          className="task-item-container__options"
        >
          <BsThreeDotsVertical />
        </div>

        <div
          className={` options-menu ${
            optionsMenuOpen === task.id ? "open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {statusOptions
            .filter((option) => option.value !== task.status)
            .map((option, index) => (
              <span
                className="options-menu__item"
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeStatus(task.id, option.value);
                  setOptionsMenuOpen(null);
                }}
              >
                {option.label}
              </span>
            ))}
          <span
            onClick={() => onDeleteTask(task.id)}
            className="options-menu__item"
          >
            {t("tasksControl.deleteSubtask")}
          </span>
        </div>
      </div>
    </>
  );
};

export default React.memo(TaskItem);
