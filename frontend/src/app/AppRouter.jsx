import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";

import Dashboard from "../features/dashboard/pages/Dashboard";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AppLayout />}>

          <Route path="/" element={<Dashboard />} />

        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;