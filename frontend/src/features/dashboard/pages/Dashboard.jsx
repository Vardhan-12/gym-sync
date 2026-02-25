import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { getSessions } from "../../session/sessionService";

const Dashboard = () => {
  const { user } = useAuth();

  const [totalSessions, setTotalSessions] = useState(0);
  const [weeklySessions, setWeeklySessions] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSessions(1);
        const sessions = data?.sessions || [];

        setTotalSessions(sessions.length);

        const now = new Date();

        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const weekly = sessions.filter((s) => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= startOfWeek;
        });

        const today = sessions.filter((s) => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= startOfToday;
        });

        setWeeklySessions(weekly.length);
        setTodaySessions(today.length);

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
          <h3>Total Sessions</h3>
          <p>{totalSessions}</p>
        </div>

        <div style={cardStyle}>
          <h3>This Week</h3>
          <p>{weeklySessions}</p>
        </div>

        <div style={cardStyle}>
          <h3>Today</h3>
          <p>{todaySessions}</p>
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