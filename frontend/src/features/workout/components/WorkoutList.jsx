import { toggleLikeWorkout } from "./workoutService";

function WorkoutList({ workouts, onDelete, refreshWorkouts }) {

  const handleLike = async (id) => {
    await toggleLikeWorkout(id);
    if (refreshWorkouts) {
  refreshWorkouts();
}
  };

  return (
    <div>

      <h3>Your Workout Sessions</h3>

      {workouts.length === 0 && <p>No workout sessions yet.</p>}

      {workouts.map((session) => (

        <div
          key={session._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px"
          }}
        >

          <h4>{session.title}</h4>

          <p>{session.exercises.length} exercises</p>

          <div>

            {session.exercises.map((ex, index) => (
              <p key={index}>
                {ex.name} — {ex.sets} x {ex.reps} @ {ex.weight}kg
              </p>
            ))}

          </div>

          <p style={{ marginTop: "10px" }}>
            ❤️ {session.likes.length} Likes  
            {" | "}
            💬 {session.comments.length} Comments
          </p>

          <button onClick={() => handleLike(session._id)}>
            Like / Unlike
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => onDelete(session._id)}
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default WorkoutList;