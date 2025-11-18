import { Route, Routes, useLocation } from "react-router-dom";
import "./AppRoute.css";

import TopBar from "../../components/topbar/TopBar";

import Login from "../../pages/auth/login/Login";
import Register from "../../pages/auth/register/Register";
import CreateTask from "../../pages/create-task/CreateTask";
import TaskControl from "../../pages/taskControl/TaskControl";

const AppRoute = () => {
  const location = useLocation();

  const hideRoute = ["/", "/register"];
  const hiddenRoute = hideRoute.includes(location.pathname);

  return (
    <>
      {!hiddenRoute && (
        <>
          <TopBar />
        </>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/task-control" element={<TaskControl />} />
      </Routes>
    </>
  );
};

export default AppRoute;
