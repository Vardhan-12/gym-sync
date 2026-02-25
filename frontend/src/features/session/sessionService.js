import axios from "../../services/axiosInstance";

export const createSession = async (data) => {
  const response = await axios.post("/sessions", data);
  return response.data;
};

export const getSessions = async (page = 1, date = "") => {
  const response = await axios.get("/sessions", {
    params: { page, date },
  });
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await axios.delete(`/sessions/${id}`);
  return response.data;
};

export const getOverlappingUsers = async (sessionId) => {
  const response = await axios.get(`/sessions/overlap/${sessionId}`);
  return response.data;
};