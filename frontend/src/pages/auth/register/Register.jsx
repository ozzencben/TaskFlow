import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../../context/language/LanguageContext";
import AuthContext from "../../../context/auth/AuthContext";
import ThemeContext from "../../../context/theme/ThemeContext";
import "./Register.css";

const Register = () => {
  const { t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(data);
      localStorage.setItem("token", res.token);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`auth-container ${theme}`}>
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h1 className="auth-header__title">{t("register.title")}</h1>
          <p className="auth-header__subtitle">{t("register.subtitle")}</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <input
            placeholder={t("register.email")}
            value={data.email}
            name="email"
            onChange={handleChange}
            className="auth-form__input"
          />
          <input
            placeholder={t("register.password")}
            value={data.password}
            name="password"
            onChange={handleChange}
            type="password"
            className="auth-form__input"
          />
          <input
            placeholder={t("register.name")}
            value={data.name}
            name="name"
            onChange={handleChange}
            className="auth-form__input"
          />
          <button type="submit" className="auth-form__button">
            {t("register.register")}
          </button>
        </form>

        <div className="auth-prompt">
          <p className="auth-prompt__text">
            {t("register.alreadyHaveAccount")}
          </p>
          <button className="auth-prompt__button" onClick={() => navigate("/")}>
            {t("register.login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
