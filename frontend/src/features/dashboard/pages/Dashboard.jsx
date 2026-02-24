import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { getWorkouts } from "../../workout/workoutService";

const Dashboard = () => {
  const { user } = useAuth();

  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkouts();

        const workouts = data.workouts || [];

        setTotalWorkouts(data.total || 0);

        const now = new Date();
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());

        const weekly = workouts.filter((workout) => {
          const workoutDate = new Date(workout.createdAt);
          return workoutDate >= startOfWeek;
        });

        setWeeklyWorkouts(weekly.length);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Workouts</h3>
          <p>{totalWorkouts}</p>
        </div>

        <div style={cardStyle}>
          <h3>This Week</h3>
          <p>{weeklyWorkouts}</p>
        </div>

        <div style={cardStyle}>
          <h3>Current Streak</h3>
          <p>Coming Soon</p>
        </div>

        <div style={cardStyle}>
          <h3>Weekly Goal</h3>
          <p>Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#f4f4f4",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "150px",
  textAlign: "center",
};

export default Dashboard;