import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/auth/AuthContext";
import LanguageContext from "../../../context/language/LanguageContext";
import ThemeContext from "../../../context/theme/ThemeContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`auth-container ${theme}`}>
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h1 className="auth-header__title">{t("login.title")}</h1>
          <p className="auth-header__subtitle">{t("login.subtitle")}</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder={t("login.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-form__input"
          />
          <input
            type="password"
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-form__input"
          />
          <button type="submit" className="auth-form__button">
            {t("login.login")}
          </button>
        </form>

        <div className="auth-prompt">
          <p className="auth-prompt__text">{t("login.alreadyHaveAccount")}</p>
          <button
            className="auth-prompt__button"
            onClick={() => navigate("/register")}
          >
            {t("login.register")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
