import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  getProfile,
  refreshToken,
} from "./authService";
import { setAuthToken } from "../../services/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // FETCH PROFILE
  // ========================
  const fetchProfile = async () => {
    const profile = await getProfile();
    setUser(profile);
  };

  // ========================
  // LOGIN
  // ========================
  const login = async (data) => {
    const res = await loginUser(data);

    setAccessToken(res.accessToken);
    setAuthToken(res.accessToken);

    await fetchProfile();
  };

  // ========================
  // LOGOUT
  // ========================
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setAccessToken(null);
    setAuthToken(null);
  };

  // ========================
  // INITIAL AUTH CHECK
  // ========================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await refreshToken();

        setAccessToken(res.accessToken);
        setAuthToken(res.accessToken);

        await fetchProfile();
      } catch (err) {
        setUser(null);
        setAccessToken(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}