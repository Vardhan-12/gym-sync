import ExerciseProgress from "../components/ExerciseProgress";
import VolumeProgress from "../components/VolumeProgress";

function ProgressPage() {
  return (
    <div>
      <h1>Workout Progress</h1>

      <ExerciseProgress />
      <VolumeProgress />
    </div>
  );
}

export default ProgressPage;