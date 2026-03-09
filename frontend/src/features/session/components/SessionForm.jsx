import { useState } from "react";
import { createSession } from "./sessionService";

const SessionForm = ({ onCreated }) => {
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createSession({
      startTime,
      duration: Number(duration),
    });

    setStartTime("");
    setDuration("");
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Session</h3>

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        max={180}
        onChange={(e) => setDuration(e.target.value)}
        required
      />

      <button type="submit">Create</button>
    </form>
  );
};

export default SessionForm;