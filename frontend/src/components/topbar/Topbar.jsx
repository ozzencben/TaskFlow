import { useContext } from "react";
import { CiLogout } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import LanguageContext from "../../context/language/LanguageContext";
import Sidebar from "../sidebar/Sidebar";
import "./Topbar.css";

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, language } = useContext(LanguageContext);

  const navigate = useNavigate();

  const formatAvatar = (avatar, name) => {
    if (!avatar || avatar === name.charAt(0).toUpperCase()) {
      return (
        <p className="topbar-user__avatar-text">
          {name.charAt(0).toUpperCase()}
        </p>
      );
    } else {
      return (
        <img src={avatar} alt={name} className="topbar-user__avatar-img" />
      );
    }
  };

  const getFormattedDate = () => {
    const date = new Date();

    return date.toLocaleDateString(language, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="topbar-wrapper">
      <div className="topbar-container">
        <div className="topbar-user">
          <div className="topbar-user_avatar">
            {user ? formatAvatar(user.avatar, user.name) : null}
          </div>
          <div className="topbar-user-text">
            <div className="topbar-user-name">
              <p className="topbar-welcome">{`${t("topbar.welcome")} ,`}</p>
              <p className="topbar-username">{user ? user.name : null}</p>
            </div>
            <p className="topbar-date">{getFormattedDate()}</p>
          </div>
        </div>

        <div className="topbar-buttons">
          <Sidebar />
          <div className="topbar-notification">
            <IoMdHome
              className="topbar-notification__icon"
              onClick={() => navigate("/task-control")}
              role="button"
            />
          </div>
          <div className="topbar-notification">
            <CiLogout
              className="topbar-notification__icon"
              onClick={logout}
              role="button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
