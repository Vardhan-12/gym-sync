import axios from "../../services/axiosInstance";

export const getDensity = async (date) => {
  const response = await axios.get(`/sessions/density?date=${date}`);
  return response.data;
};

export const getPeakHours = async () => {
  const response = await axios.get("/sessions/peak-hours");
  return response.data;
};

export const getBestTime = async () => {
  const response = await axios.get("/sessions/best-time");
  return response.data;
};

export const getWeeklySummary = async () => {
  const response = await axios.get("/sessions/weekly-summary");
  return response.data;
};