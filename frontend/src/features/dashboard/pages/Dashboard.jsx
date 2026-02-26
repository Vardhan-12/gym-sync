import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { getSessionSummary } from "../../session/sessionService";


const Dashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    totalSessions: 0,
    weeklySessions: 0,
    todaySessions: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getSessionSummary();
        setSummary(data);
      } catch (error) {
        console.error("Summary fetch error:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
  <div className="container fade-in">
    <h1>Welcome, {user?.name}</h1>

    <div className="grid-3" style={{ marginTop: "20px" }}>
      <StatCard title="Total Sessions" value={summary.totalSessions} />
      <StatCard title="This Week" value={summary.weeklySessions} />
      <StatCard title="Today" value={summary.todaySessions} />
    </div>
  </div>
);
};

const StatCard = ({ title, value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3>{title}</h3>
      <h2 style={{ marginTop: "10px", color: "#2563eb" }}>
        {displayValue}
      </h2>
    </div>
  );
};

export default Dashboard;