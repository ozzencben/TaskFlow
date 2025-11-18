import { useEffect, useState } from "react";
import en from "../../locale/en.json";
import tr from "../../locale/tr.json";
import LanguageContext from "./LanguageContext";

const languages = {
  en,
  tr,
};
const defaultLanguage = "en";

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage && languages[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language || navigator.userLanguage;
      const shortLang = browserLang.split("-")[0];

      if (languages[shortLang]) {
        setLanguage(shortLang);
        localStorage.setItem("language", shortLang);
      } else {
        setLanguage(defaultLanguage);
        localStorage.setItem("language", defaultLanguage);
      }
    }
  }, []);

  const toggleLanguage = (lang) => {
    if (languages[lang]) {
      setLanguage(lang);
      localStorage.setItem("language", lang);
    }
  };

  const translation = languages[language];

  const t = (key) =>
    key.split(".").reduce((obj, k) => obj?.[k], translation) || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
