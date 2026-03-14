import WorkoutList from "../../workout/WorkoutList";
import { getWorkouts } from "../../workout/workoutService";

function ProfilePage() {

  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getWorkouts();
    setWorkouts(data);
  };

  return (
    <div>

      <h1>My Profile</h1>

      <WorkoutList workouts={workouts} />

    </div>
  );
}

export default ProfilePage;