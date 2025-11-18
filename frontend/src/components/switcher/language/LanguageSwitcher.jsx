import { useContext } from "react";
import LanguageContext from "../../../context/language/LanguageContext";
import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  const buttonName = language === "en" ? "tr" : "en";

  return (
    <div
      role="button"
      className="language-button switcher"
      onClick={() => toggleLanguage(language === "en" ? "tr" : "en")}
    >
      {buttonName}
    </div>
  );
};

export default LanguageSwitcher;
