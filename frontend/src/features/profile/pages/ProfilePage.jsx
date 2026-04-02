import { useState, useEffect } from "react";
import WorkoutList from "../../workout/WorkoutList";
import { getWorkouts } from "../../workout/workoutService";
import {
  getIncomingRequests,
  respondToRequest,
} from "../profileService";

function ProfilePage() {
  const [workouts, setWorkouts] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadWorkouts();
    loadRequests();
  }, []);

  const loadWorkouts = async () => {
    const data = await getWorkouts();
    setWorkouts(data || []);
  };

  const loadRequests = async () => {
    const data = await getIncomingRequests();
    setRequests(data);
  };

  const handleResponse = async (id, action) => {
    await respondToRequest(id, action);
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h1>My Profile</h1>

      <p>Your completed workouts and activity</p>

      <WorkoutList
        workouts={workouts}
        refreshWorkouts={loadWorkouts}
      />

      <h2 style={{ marginTop: "30px" }}>Incoming Requests</h2>

      {requests.length === 0 && <p>No requests</p>}

      {requests.map((req) => (
        <div key={req._id} style={requestCard}>
          <p>{req.requester.name}</p>

          <button onClick={() => handleResponse(req._id, "accepted")}>
            Accept
          </button>

          <button onClick={() => handleResponse(req._id, "rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

const requestCard = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "10px",
};

export default ProfilePage;