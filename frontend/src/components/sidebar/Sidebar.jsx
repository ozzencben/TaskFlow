import LanguageSwitcher from "../switcher/language/LanguageSwitcher";
import ThemeSwitcher from "../switcher/theme/ThemeSwitcher";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="switcher-container">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  );
};

export default Sidebar;
