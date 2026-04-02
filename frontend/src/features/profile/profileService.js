import axios from "../../services/axiosInstance";

// Get users from sessions
export const getUsersFromSessions = async () => {
  const res = await axios.get("/users/from-sessions");
  return res.data;
};

// Send request
export const sendMatchRequest = async (recipientId) => {
  const res = await axios.post("/match/request", { recipientId });
  return res.data;
};

// Get all matches (for button state)
export const getMyMatches = async () => {
  const res = await axios.get("/match/my");
  return res.data;
};

// Incoming requests
export const getIncomingRequests = async () => {
  const res = await axios.get("/match/incoming");
  return res.data;
};

// Accept / Reject
export const respondToRequest = async (matchId, action) => {
  const res = await axios.post("/match/respond", {
    matchId,
    action,
  });
  return res.data;
};