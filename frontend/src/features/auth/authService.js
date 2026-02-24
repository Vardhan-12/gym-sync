import axiosInstance from "../../services/axiosInstance";

// LOGIN
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

// LOGOUT
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

// GET PROFILE
export const getProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

// REFRESH TOKEN
export const refreshToken = async () => {
  const response = await axiosInstance.post("/auth/refresh-token");
  return response.data;
};