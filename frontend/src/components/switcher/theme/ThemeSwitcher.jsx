import { useContext } from "react";
import ThemeContext from "../../../context/theme/ThemeContext";
import "./ThemeSwitcher.css";
import { MdWbSunny } from "react-icons/md";
import { HiMoon } from "react-icons/hi";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div role="button" className="theme-button switcher" onClick={toggleTheme}>
      {theme === "light" ? <MdWbSunny /> : <HiMoon />}
    </div>
  );
};

export default ThemeSwitcher;
