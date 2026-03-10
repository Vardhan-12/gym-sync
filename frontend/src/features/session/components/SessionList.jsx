import { useEffect } from "react";
import { getSessions, deleteSession } from "../sessionService";

function SessionList({ sessions, setSessions }) {

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const response = await getSessions();
    setSessions(response.data.sessions || []);
  }

  async function handleDelete(id) {
    await deleteSession(id);
    setSessions(prev => prev.filter(s => s._id !== id));
  }

  return (
    <div>

      <h3>Your Sessions</h3>

      {sessions.map((session) => {

        const date = new Date(session.startTime);

        return (
          <div key={session._id}>

            <p>Date: {date.toLocaleDateString()}</p>
            <p>Time: {date.toLocaleTimeString()}</p>
            <p>Duration: {session.duration} minutes</p>

            <button onClick={() => handleDelete(session._id)}>
              Delete
            </button>

          </div>
        );
      })}

    </div>
  );
}

export default SessionList;