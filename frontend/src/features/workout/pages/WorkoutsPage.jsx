import { useEffect, useState } from "react";
import {
  getWorkouts,
  createWorkout,
  deleteWorkout,
} from "../workoutService";

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  const fetchWorkouts = async () => {
    try {
      const data = await getWorkouts(page);
      setWorkouts(data.workouts);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createWorkout({
        title,
        duration: Number(duration),
      });

      setTitle("");
      setDuration("");

      fetchWorkouts();
    } catch (err) {
      console.error("Create error:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkout(id);
      fetchWorkouts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <h1>Workouts</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} style={formStyle}>
        <input
          placeholder="Workout Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Duration (minutes)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <button type="submit">Add</button>
      </form>

      {/* WORKOUT LIST */}
      <div style={{ marginTop: "20px" }}>
        {workouts.length === 0 ? (
          <p>No workouts yet</p>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id} style={cardStyle}>
              <h3>{workout.title}</h3>
              <p>Duration: {workout.duration} minutes</p>

              <button onClick={() => handleDelete(workout._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const formStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const cardStyle = {
  background: "#f4f4f4",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "6px",
};

export default WorkoutsPage;