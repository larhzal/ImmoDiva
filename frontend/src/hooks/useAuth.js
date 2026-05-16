import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("immodiva_token");
    // console.log('token',token);
    if (!token) {
      setLoading(false);
      return;
    }

    axiosClient
      .get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("immodiva_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, logout };
};