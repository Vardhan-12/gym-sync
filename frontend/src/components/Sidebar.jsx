import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        background: "#111827",
        color: "white",
        padding: "30px 20px",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>GymSync</h2>

      <NavLink
        to="/dashboard"
        style={linkStyle}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/sessions"
        style={linkStyle}
      >
        Sessions
      </NavLink>
    </div>
  );
};

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 15px",
  marginBottom: "10px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "white",
  background: isActive ? "#2563eb" : "transparent",
});

export default Sidebar;