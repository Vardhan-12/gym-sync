import { useState } from "react";
import { createWorkout } from "./workoutService";

function WorkoutForm({ onWorkoutAdded }) {

  const [form, setForm] = useState({
    exercise: "",
    muscleGroup: "",
    sets: "",
    reps: "",
    weight: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = await createWorkout(form);

    onWorkoutAdded(workout);

    setForm({
      exercise: "",
      muscleGroup: "",
      sets: "",
      reps: "",
      weight: ""
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      <h3>Add Workout</h3>

      <input
        name="exercise"
        placeholder="Exercise"
        value={form.exercise}
        onChange={handleChange}
        required
      />

      <input
        name="muscleGroup"
        placeholder="Muscle Group"
        value={form.muscleGroup}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="sets"
        placeholder="Sets"
        value={form.sets}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="reps"
        placeholder="Reps"
        value={form.reps}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="weight"
        placeholder="Weight"
        value={form.weight}
        onChange={handleChange}
        required
      />

      <button type="submit">Save Workout</button>

    </form>
  );
}

export default WorkoutForm;