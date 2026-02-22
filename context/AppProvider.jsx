import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  /* =========================
     Fetch Logged In User
  ========================= */
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      }
    } catch (error) {
      console.log(error);
      logout(); // auto logout if token invalid
    } finally {
      setLoadingUser(false);
    }
  }, []);

  /* =========================
     Attach Token
  ========================= */
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      fetchUser();
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsOwner(false);
      setLoadingUser(false);
    }
  }, [token, fetchUser]);

  /* =========================
     Become Owner
  ========================= */
  const becomeOwner = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        setUser(data.user);
        setIsOwner(true);
        toast.success("You are now Owner 🚀");
        navigate("/owner/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  /* =========================
     Logout
  ========================= */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsOwner(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/", { replace: true });
    toast.success("Logged out successfully");
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        user,
        isOwner,
        showLogin,
        setShowLogin,
        logout,
        becomeOwner,
        loadingUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
