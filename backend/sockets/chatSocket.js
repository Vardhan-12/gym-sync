/*
====================================================
CHAT SOCKET HANDLER

Purpose:
- Handle realtime chat events
- Keep socket logic separated from server.js
- Improve scalability and maintainability

====================================================
*/

module.exports = (io) => {

  // runs whenever a user connects
  io.on("connection", (socket) => {

    console.log("⚡ User connected:", socket.id);

    /* =================================================
       JOIN ROOM
       Each match has separate private room
    ================================================= */
    socket.on("joinRoom", (matchId) => {

      console.log("📦 Joining room:", matchId);

      socket.join(matchId);

    });

    /* =================================================
       SEND MESSAGE
       Broadcast realtime message to room
    ================================================= */
    socket.on("sendMessage", (message) => {

      console.log("📨 Broadcasting message:", message.text);

      // send to everyone EXCEPT sender
      socket.to(message.matchId).emit("receiveMessage", message);

    });

    /* =================================================
       TYPING EVENTS
    ================================================= */
    socket.on("typing", (matchId) => {
      socket.to(matchId).emit("typing");
    });

    socket.on("stopTyping", (matchId) => {
      socket.to(matchId).emit("stopTyping");
    });

    /* =================================================
       READ RECEIPTS
    ================================================= */
    socket.on("markAsRead", (matchId) => {
      socket.to(matchId).emit("messagesRead");
    });

    /* =================================================
       DISCONNECT
    ================================================= */
    socket.on("disconnect", () => {

      console.log("❌ User disconnected:", socket.id);

    });

  });

};