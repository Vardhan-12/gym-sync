import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../features/auth/authContext";

function Sidebar() {

  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ width: "200px" }}>

      <p><Link to="/">Dashboard</Link></p>
      <p><Link to="/sessions">Sessions</Link></p>
      <p><Link to="/workouts">Workouts</Link></p>
      <p><Link to="/progress">Progress</Link></p>

      {!user ? (
        <p><Link to="/">Login</Link></p>
      ) : (
        <p onClick={logout} style={{cursor:"pointer"}}>Logout</p>
      )}

    </div>
  );
}

export default Sidebar;