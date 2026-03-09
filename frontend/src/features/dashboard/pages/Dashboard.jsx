import { useContext } from "react";
import { AuthContext } from "../../auth/authContext";
import { getRandomQuote } from "../../../utils/quotes";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const quote = getRandomQuote();

  if (!user) {
    return (
      <div>
        <h1>Welcome to GymSync</h1>

        <h3>Motivation</h3>
        <p>{quote}</p>

        <p style={{marginTop:"20px"}}>
          Login to unlock GymSync features.
        </p>
      </div>
    );
  }

  return (
    <div>

      <h1>Dashboard</h1>

      <h3>Motivation</h3>
      <p>{quote}</p>

      <h3 style={{marginTop:"30px"}}>Gym Crowd Prediction</h3>
      <p>Prediction feature coming soon...</p>

      <h3 style={{marginTop:"30px"}}>Previous Workout</h3>
      <p>No workouts logged yet.</p>

      <h3 style={{marginTop:"30px"}}>About GymSync</h3>
      <p>
        GymSync helps you track workouts, find gym partners,
        and analyze gym crowd density.
      </p>

    </div>
  );
}

export default Dashboard;