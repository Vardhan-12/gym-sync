import { useState } from "react";
import { createWorkout } from "../workoutService";

function WorkoutForm({ onWorkoutAdded }) {

  const [title, setTitle] = useState("");

  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "" }
  ]);


  // update exercise field
  const handleExerciseChange = (index, field, value) => {

    const updated = [...exercises];
    updated[index][field] = value;

    setExercises(updated);
  };


  // add new exercise
  const addExercise = () => {

    setExercises([
      ...exercises,
      { name: "", sets: "", reps: "", weight: "" }
    ]);
  };


  // remove exercise
  const removeExercise = (index) => {

    const updated = exercises.filter((_, i) => i !== index);

    setExercises(updated);
  };


  // save workout
  const handleSubmit = async (e) => {

    e.preventDefault();

    const formattedExercises = exercises.map((ex) => ({
      name: ex.name,
      sets: Number(ex.sets),
      reps: Number(ex.reps),
      weight: Number(ex.weight)
    }));

    const data = {
      title,
      exercises: formattedExercises
    };

    await createWorkout(data);

    // reset form
    setTitle("");
    setExercises([{ name: "", sets: "", reps: "", weight: "" }]);

    // refresh library
    if (onWorkoutAdded) {
      onWorkoutAdded();
    }

  };


  return (

    <div>

      <h3>Create Workout Session</h3>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Session title (Chest & Triceps)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {exercises.map((exercise, index) => (

          <div key={index} style={{ marginTop: "10px" }}>

            <input
              placeholder="Exercise name"
              value={exercise.name}
              onChange={(e) =>
                handleExerciseChange(index, "name", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) =>
                handleExerciseChange(index, "sets", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) =>
                handleExerciseChange(index, "reps", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Weight"
              value={exercise.weight}
              onChange={(e) =>
                handleExerciseChange(index, "weight", e.target.value)
              }
            />

            <button type="button" onClick={() => removeExercise(index)}>
              Remove
            </button>

          </div>

        ))}

        <button type="button" onClick={addExercise}>
          Add Exercise
        </button>

        <br />

        <button type="submit">
          Save Workout
        </button>

      </form>

    </div>

  );
}

export default WorkoutForm;