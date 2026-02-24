import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../shared/components/ProtectedRoute.jsx";
import AppLayout from "./AppLayout.jsx";

import Login from "../features/auth/pages/Login.jsx";
import Dashboard from "../features/dashboard/pages/Dashboard.jsx";
import WorkoutsPage from "../features/workout/pages/WorkoutsPage.jsx";
import GoalsPage from "../features/goals/pages/GoalsPage.jsx";
import StatsPage from "../features/stats/pages/StatsPage.jsx";
import AchievementsPage from "../features/achievements/pages/AchievementsPage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="workouts" element={<WorkoutsPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRouter;