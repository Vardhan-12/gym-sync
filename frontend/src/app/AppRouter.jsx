import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  );
}

export default AppRouter;