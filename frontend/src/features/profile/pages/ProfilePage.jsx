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

  // ✅ single loader (cleaner)
  const loadAll = async () => {
    const [w, r, m] = await Promise.all([
      getWorkouts(),
      getIncomingRequests(),
      getMyMatches(),
    ]);

    setWorkouts(w || []);
    setRequests(r || []);
    setMatches(m || []);
  };

  const handleResponse = async (id, action) => {
    await respondToRequest(id, action);

    if (action === "accepted") {
      navigate(`/chat/${id}`);
    }

    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h1>My Profile</h1>

      {/* 🔹 WORKOUTS */}
      <WorkoutList workouts={workouts} refreshWorkouts={loadAll} />

      {/* 🔹 INCOMING REQUESTS */}
      <h2 style={{ marginTop: "30px" }}>Incoming Requests</h2>

      {requests.length === 0 && <p>No requests</p>}

      {requests.map((req) => (
        <div key={req._id} style={card}>
          <p>{req.requester.name}</p>

          <button onClick={() => handleResponse(req._id, "accepted")}>
            Accept
          </button>

          <button onClick={() => handleResponse(req._id, "rejected")}>
            Reject
          </button>
        </div>
      ))}

      {/* 🔹 MY CHATS (IMPORTANT FIX) */}
      <h2 style={{ marginTop: "30px" }}>My Chats</h2>

      {matches.length === 0 && <p>No chats yet</p>}

      {matches.map((match) => {
        const myId = localStorage.getItem("userId");

        const otherUser =
          match.requester._id === myId
            ? match.recipient
            : match.requester;

        return (
          <div key={match._id} style={card}>
            <p>{otherUser.name}</p>

            <button onClick={() => navigate(`/chat/${match._id}`)}>
              Open Chat
            </button>
          </div>
        );
      })}
    </div>
  );
}

const card = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "10px",
};

export default ProfilePage;