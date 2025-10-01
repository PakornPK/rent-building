import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import authProxy from "../proxy/authProxy";

export function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const { exp } = jwtDecode(token);
      const expiresIn = exp * 1000 - Date.now();

      if (expiresIn <= 0) {
        refreshToken(); 
      } else {
        const timer = setTimeout(refreshToken, expiresIn - 60 * 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      logout();
    }
  }, [navigate]);

  const refreshToken = async () => {
    try {
      const res = await authProxy.refreshToken();
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("token_type", res.token_type);
    } catch (err) {
      logout();
    }
  };

  const logout = () => {
    authProxy.logout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    navigate("/login");
  };
}
