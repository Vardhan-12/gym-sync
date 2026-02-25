import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  // If context somehow not ready
  if (!auth) {
    return null;
  }

  const { user, loading } = auth;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;