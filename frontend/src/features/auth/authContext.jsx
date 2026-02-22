import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  getProfile,
  refreshToken,
} from "./authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (data) => {
    const res = await loginUser(data);
    setAccessToken(res.accessToken);
    await fetchProfile();
  };

  // LOGOUT
  const logout = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
  };

  // FETCH PROFILE
  const fetchProfile = async () => {
    const profile = await getProfile();
    setUser(profile);
  };

  // TRY REFRESH ON APP LOAD
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await refreshToken();
        setAccessToken(res.accessToken);
        await fetchProfile();
      } catch (err) {
        setUser(null);
        setAccessToken(null);
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