import { deleteWorkout } from "./workoutService";

function WorkoutList({ workouts, onDelete }) {

  return (
    <div>

      <h3>Your Workouts</h3>

      {workouts.length === 0 && <p>No workouts yet.</p>}

      {workouts.map((w) => (
        <div key={w._id} style={{ marginBottom: "15px" }}>

          <p>Exercise: {w.exercise}</p>
          <p>Muscle Group: {w.muscleGroup}</p>
          <p>Sets: {w.sets}</p>
          <p>Reps: {w.reps}</p>
          <p>Weight: {w.weight} kg</p>

          <button onClick={() => onDelete(w._id)}>Delete</button>

        </div>
      ))}

    </div>
  );
}

export default WorkoutList;