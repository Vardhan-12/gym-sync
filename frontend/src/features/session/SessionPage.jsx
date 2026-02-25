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
  <div>
    <h2>Gym Sessions</h2>

    <SessionForm onCreated={fetchSessions} />

    <SessionList sessions={sessions} onDeleted={fetchSessions} />

    <div style={{ marginTop: "20px" }}>
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Prev
      </button>
      <button onClick={() => setPage((p) => p + 1)}>
        Next
      </button>
    </div>

    {/* 🔥 Density Visualization */}
    <DensityView />
  </div>
);
};

export default SessionPage;