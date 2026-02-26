import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";
import SessionPage from "../features/session/SessionPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./AppLayout";

function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  }
/>

      <Route
  path="/sessions"
  element={
    <ProtectedRoute>
      <AppLayout>
        <SessionPage />
      </AppLayout>
    </ProtectedRoute>
  }
/>
      

    </Routes>
  );
}

export default AppRouter;