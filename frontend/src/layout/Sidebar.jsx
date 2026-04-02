import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../features/auth/authContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ width: "200px", padding: "20px" }}>
      <h3>GymSync</h3>

      <p><Link to="/">Dashboard</Link></p>
      <p><Link to="/sessions">Sessions</Link></p>
      <p><Link to="/workouts">Workouts</Link></p>
      <p><Link to="/progress">Progress</Link></p>

      {/* 👇 Profile separation */}
      <p><Link to="/profiles">Find Partners</Link></p>
      <p><Link to="/profile">My Profile</Link></p>
      

      {!user ? (
        <p><Link to="/">Login</Link></p>
      ) : (
        <p onClick={logout} style={{ cursor: "pointer", color: "red" }}>
          Logout
        </p>
      )}
    </div>
  );
}

export default Sidebar;