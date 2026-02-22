import axiosInstance from "../../services/axiosInstance";

export const registerUser = async (data) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  console.log("LOGIN API CALLED", data);
  const response = await axiosInstance.post("/users/login", data);
  console.log("LOGIN RESPONSE", response);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/users/profile");
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post("/users/refresh");
  return response.data;
};