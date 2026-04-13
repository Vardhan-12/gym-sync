import { useState, useEffect } from "react";
import WorkoutList from "../../workout/WorkoutList";
import { getWorkouts } from "../../workout/workoutService";
import {
  getIncomingRequests,
  respondToRequest,
  getMyMatches,
} from "../profileService";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [workouts, setWorkouts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadAll();
  }, []);

  // ✅ single loader (clean + safe)
  const loadAll = async () => {
    try {
      const [w, r, m] = await Promise.all([
        getWorkouts(),
        getIncomingRequests(),
        getMyMatches(),
      ]);

      setWorkouts(w || []);
      setRequests(r || []);
      
      const sortedMatches = (m || []).sort((a, b) => {
  const timeA = a.lastMessage?.createdAt || a.createdAt;
  const timeB = b.lastMessage?.createdAt || b.createdAt;

  return new Date(timeB) - new Date(timeA);
});

setMatches(sortedMatches);

    } catch (err) {
      console.log("Load error:", err);
    }
  };

  const handleResponse = async (id, action) => {
    try {
      await respondToRequest(id, action);

      if (action === "accepted") {
        navigate(`/chat/${id}`);
      }

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log("Response error:", err);
    }
  };

  return (
    <div>
      <h1>My Profile</h1>

      {/* 🔹 WORKOUTS */}
      <WorkoutList workouts={workouts} refreshWorkouts={loadAll} />

      {/* 🔹 INCOMING REQUESTS */}
      <h2 style={{ marginTop: "30px" }}>Incoming Requests</h2>

      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} style={card}>
            <p>{req.requester?.name}</p>

            <button onClick={() => handleResponse(req._id, "accepted")}>
              Accept
            </button>

            <button onClick={() => handleResponse(req._id, "rejected")}>
              Reject
            </button>
          </div>
        ))
      )}

      {/* 🔹 MY CHATS */}
      <h2 style={{ marginTop: "30px" }}>My Chats</h2>

      {matches.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        matches.map((match) => {
          const myId = localStorage.getItem("userId");

          const otherUser =
            match.requester?._id === myId
              ? match.recipient
              : match.requester;

          return (
            <div key={match._id} style={card}>
              <div>
                <p style={{ fontWeight: "bold" }}>
                  {otherUser?.name || "User"}
                </p>

                <p style={{ fontSize: "12px", color: "gray" }}>
  {match.lastMessage
    ? `${
        match.lastMessage.sender === localStorage.getItem("userId")
          ? "You: "
          : ""
      }${match.lastMessage.text}`
    : "No messages yet"}
</p>

                {match.lastMessage && (
                  <p style={{ fontSize: "10px", color: "gray" }}>
                    {new Date(
                      match.lastMessage.createdAt
                    ).toLocaleTimeString()}
                  </p>
                )}
              </div>

              <button onClick={() => navigate(`/chat/${match._id}`)}>
                Open
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

export default ProfilePage;