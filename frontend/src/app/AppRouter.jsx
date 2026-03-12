import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../features/auth/authContext";
import AppLayout from "./AppLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import SessionPage from "../features/session/pages/SessionPage";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import WorkoutPage from "../features/workout/pages/WorkoutPage";
import ProgressPage from "../features/progress/pages/ProgressPage";

function AppRouter() {

  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        {!user && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/* Protected routes */}
        {user && (
          <>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sessions" element={<SessionPage />} />
              <Route path="/workouts" element={<WorkoutPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;