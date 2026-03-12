import { useEffect, useState } from "react";
import WorkoutForm from "../WorkoutForm";
import WorkoutList from "../WorkoutList";
import { getWorkouts, deleteWorkout } from "../workoutService";

function WorkoutPage() {

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const data = await getWorkouts();
    setWorkouts(data);
  };

  const handleWorkoutAdded = (workout) => {
    setWorkouts([workout, ...workouts]);
  };

  const handleDelete = async (id) => {
    await deleteWorkout(id);

    setWorkouts(workouts.filter((w) => w._id !== id));
  };

  return (
    <div>

      <h1>Workout Tracker</h1>

      <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />

      <WorkoutList workouts={workouts} onDelete={handleDelete} />

    </div>
  );
}

export default WorkoutPage;