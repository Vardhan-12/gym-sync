import { useEffect, useState } from "react";
import { getSessions } from "./sessionService";
import SessionForm from "./SessionForm";
import SessionList from "./SessionList";
import DensityView from "./DensityView";

const SessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);

  const fetchSessions = async () => {
    const data = await getSessions(page);
    setSessions(data.sessions);
  };

  useEffect(() => {
    fetchSessions();
  }, [page]);

return (
  <div className="container  fade-in">
    <h2>Gym Sessions</h2>

    <div className="card" style={{ marginTop: "20px" }}>
      <SessionForm onCreated={fetchSessions} />
    </div>

    <div style={{ marginTop: "20px" }}>
      <SessionList sessions={sessions} onDeleted={fetchSessions} />
    </div>

    <div style={{ marginTop: "20px" }}>
      <button
        className="button button-secondary"
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      <button
        className="button button-secondary"
        style={{ marginLeft: "10px" }}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>
    </div>

    <DensityView />
  </div>
);
};

export default SessionPage;