import axiosInstance from "../../services/axiosInstance";

// GET WORKOUTS (paginated)
export const getWorkouts = async (page = 1) => {
  const response = await axiosInstance.get(`/workouts?page=${page}`);
  return response.data;
};

// CREATE WORKOUT
export const createWorkout = async (data) => {
  const response = await axiosInstance.post("/workouts", data);
  return response.data;
};

// DELETE WORKOUT
export const deleteWorkout = async (id) => {
  const response = await axiosInstance.delete(`/workouts/${id}`);
  return response.data;
};