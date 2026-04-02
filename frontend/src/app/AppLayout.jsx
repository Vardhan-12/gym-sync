import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

function AppLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "20px", width: "100%" }}>
        <Outlet />   {/* ✅ THIS CONTROLS PAGE SWITCH */}
      </div>
    </div>
  );
}

export default AppLayout;