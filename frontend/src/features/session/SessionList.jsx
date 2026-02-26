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
      <h3 style={{ marginBottom: "15px" }}>Sessions</h3>

      {sessions.length === 0 && (
        <div className="card">No sessions found.</div>
      )}

      {sessions.map((s) => (
        <div
          key={s._id}
          className="card"
          style={{ marginBottom: "15px" }}
        >
          <p style={{ marginBottom: "10px" }}>
            <strong>
              {new Date(s.startTime).toLocaleString()}
            </strong>
            {" | "}
            {s.duration} mins
            {" | "}
            {s.createdBy?.name}
          </p>

          <div>
            <button
              className="button button-danger"
              onClick={() => handleDelete(s._id)}
            >
              Delete
            </button>

            <button
              className="button button-primary"
              style={{ marginLeft: "10px" }}
              onClick={() => handleOverlap(s._id)}
            >
              View Overlaps
            </button>
          </div>

          {loadingId === s._id && (
            <p style={{ marginTop: "10px" }}>Loading...</p>
          )}

          {overlaps[s._id] && (
            <div style={{ marginTop: "15px" }}>
              <strong>Overlapping Users:</strong>

              {overlaps[s._id].length === 0 && (
                <p style={{ marginTop: "5px", color: "#6b7280" }}>
                  No overlaps ≥ 30 minutes
                </p>
              )}

              {overlaps[s._id].map((user) => (
                <div
                  key={user._id}
                  style={{
                    marginTop: "6px",
                    padding: "6px 10px",
                    background: "#f3f4f6",
                    borderRadius: "6px",
                  }}
                >
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