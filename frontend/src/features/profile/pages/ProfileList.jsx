import { useEffect, useState } from "react";
import {
  getUsersFromSessions,
  sendMatchRequest,
} from "../profileService";

function ProfileList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsersFromSessions();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequest = async (userId) => {
    try {
      await sendMatchRequest(userId);
      alert("Request sent");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  return (
    <div>
      <h2>Find Workout Partners</h2>

      {users.length === 0 && <p>No users found</p>}

      {users.map((user) => (
        <div key={user._id} style={cardStyle}>
          {/* Avatar */}
          <div style={avatarStyle}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>
              Joined: {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Button */}
          <button
            style={btnStyle}
            onClick={() => handleRequest(user._id)}
          >
            Send Request
          </button>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  background: "orange",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "10px",
};

const avatarStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
};

const btnStyle = {
  marginLeft: "auto",
  cursor: "pointer",
};

export default ProfileList;