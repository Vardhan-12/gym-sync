import { useState } from "react";
import SessionForm from "../components/SessionForm";
import SessionList from "../components/SessionList";

function SessionPage() {

  const [sessions, setSessions] = useState([]);

  return (
    <div>

      <h2>Gym Sessions</h2>

      <SessionForm setSessions={setSessions} />

      <SessionList sessions={sessions} setSessions={setSessions} />

    </div>
  );
}

export default SessionPage;