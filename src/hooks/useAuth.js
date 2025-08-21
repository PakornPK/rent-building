import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

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
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("refresh fail");
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
    } catch (err) {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
}
