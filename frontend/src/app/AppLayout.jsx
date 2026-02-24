import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar";

const AppLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;