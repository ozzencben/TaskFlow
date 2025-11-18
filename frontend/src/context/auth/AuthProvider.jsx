import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);

  // logout fonksiyonunu useCallback ile sarmaladık
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  // sayfa yüklendiğinde user bilgisini getir
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get("/users/me"); // token header'da olacak
          setUser(res.data.user);
        } catch (err) {
          console.error("Fetch user error:", err);
          logout(); // token geçersizse logout
        }
      }
    };
    fetchUser();
  }, [token, logout]); // logout burada dependency olarak ekli

  const login = async (data) => {
    try {
      const res = await api.post("/users/login", data);
      if (res?.data?.token && res?.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        navigate("/task-control");
      } else {
        toast.error("Login failed: Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed!");
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post("/users/register", data);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Registration failed!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
