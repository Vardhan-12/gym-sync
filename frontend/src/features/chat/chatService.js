import axios from "../../services/axiosInstance";

export const getMessages = async (matchId) => {
  const res = await axios.get(`/chat/${matchId}`);
  return res.data;
};

export const sendMessage = async (matchId, text) => {
  const res = await axios.post("/chat/send", {
    matchId,
    text,
  });
  return res.data;
};