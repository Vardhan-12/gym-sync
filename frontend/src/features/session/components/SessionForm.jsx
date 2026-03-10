import { useState } from "react";
import { createSession } from "../sessionService";

function SessionForm({ setSessions }) {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {

      const startTime = new Date(`${date}T${time}`);

      const response = await createSession({
        startTime,
        duration
      });

      alert("Session saved");

      // add new session to UI immediately
      setSessions(prev => [response.data, ...prev]);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <h3>Create Session</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button type="submit">Save Session</button>

    </form>
  );
}

export default SessionForm;