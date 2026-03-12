import axios from "../../services/axiosInstance";

export const createWorkout = async (data) => {
  const response = await axios.post("/workouts", data);
  return response.data;
};

export const getWorkouts = async () => {
  const response = await axios.get("/workouts");
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await axios.delete(`/workouts/${id}`);
  return response.data;
};

export const getWorkoutProgress = async (exercise) => {
  const response = await axios.get(`/workouts/progress/${exercise}`);
  return response.data;
};

export const getLatestWorkout = async () => {
  const response = await axios.get("/workouts/latest");
  return response.data;
};