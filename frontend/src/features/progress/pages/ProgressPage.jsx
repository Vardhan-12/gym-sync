import { useState } from "react";
import ProgressChart from "../ProgressChart";
import { getWorkoutProgress } from "../../workout/workoutService";

function ProgressPage() {

  const [exercise, setExercise] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    const result = await getWorkoutProgress(exercise);
    setData(result);
  };

  return (
    <div>

      <h1>Workout Progress</h1>

      <input
        placeholder="Exercise (e.g. Bench Press)"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />

      <button onClick={handleSearch}>View Progress</button>

      {data.length > 0 && <ProgressChart data={data} />}

    </div>
  );
}

export default ProgressPage;