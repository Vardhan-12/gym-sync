import { useState } from "react";
import { deleteSession, getOverlappingUsers } from "./sessionService";

const SessionList = ({ sessions, onDeleted }) => {
  const [overlaps, setOverlaps] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (id) => {
    await deleteSession(id);
    onDeleted();
  };

  const handleOverlap = async (id) => {
    setLoadingId(id);
    const users = await getOverlappingUsers(id);

    setOverlaps((prev) => ({
      ...prev,
      [id]: users,
    }));

    setLoadingId(null);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Sessions</h3>

      {sessions.map((s) => (
        <div
          key={s._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <p>
            <strong>
              {new Date(s.startTime).toLocaleString()}
            </strong>{" "}
            | {s.duration} mins | {s.createdBy?.name}
          </p>

          <button onClick={() => handleDelete(s._id)}>
            Delete
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => handleOverlap(s._id)}
          >
            View Overlaps
          </button>

          {loadingId === s._id && <p>Loading...</p>}

          {overlaps[s._id] && (
            <div style={{ marginTop: "10px" }}>
              <strong>Overlapping Users:</strong>

              {overlaps[s._id].length === 0 && (
                <p>No overlaps ≥ 30 minutes</p>
              )}

              {overlaps[s._id].map((user) => (
                <div key={user._id}>
                  {user.name} ({user.email})
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SessionList;