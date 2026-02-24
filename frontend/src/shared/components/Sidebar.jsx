import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        background: "#111",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>GymSync</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/dashboard" style={{ color: "white" }}>
          Dashboard
        </Link>

        <Link to="/dashboard/workouts" style={{ color: "white" }}>
          Workouts
        </Link>

        <Link to="/dashboard/goals" style={{ color: "white" }}>
          Goals
        </Link>

        <Link to="/dashboard/stats" style={{ color: "white" }}>
          Stats
        </Link>

        <Link to="/dashboard/achievements" style={{ color: "white" }}>
          Achievements
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;