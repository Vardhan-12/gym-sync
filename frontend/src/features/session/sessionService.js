import axiosInstance from "../../services/axiosInstance";

export const createSession = async (data) => {
  const response = await axiosInstance.post("/sessions", data);
  return response.data;
};

export const getSessions = async (page = 1) => {
  const response = await axiosInstance.get(`/sessions?page=${page}`);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await axiosInstance.delete(`/sessions/${id}`);
  return response.data;
};