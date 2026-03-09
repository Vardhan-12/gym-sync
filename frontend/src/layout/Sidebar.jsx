import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        minHeight: "100vh",
        borderRight: "1px solid #ddd",
        padding: "20px",
        background: "#f7f7f7"
      }}
    >
      <p><Link to="/">Dashboard</Link></p>
      <p><Link to="/sessions">Sessions</Link></p>
      <p><Link to="/interact">Interact</Link></p>
      <p><Link to="/profile">Profile</Link></p>
      <p><Link to="/progress">Progress</Link></p>
      <p><Link to="/login">Login</Link></p>
    </div>
  );
}

export default Sidebar;