import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../context/language/LanguageContext";
import "./TaskControl.css";
import TaskList from "./components/TaskList/TaskList";

const TaskControl = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <div className="task-control-container">
      <div className="task-control-container__header">
        <button
          onClick={() => navigate("/create-task")}
          className="task-create-button"
        >
          {t("tasksControl.createTask")}
        </button>
      </div>
      <TaskList />
    </div>
  );
};

export default TaskControl;
