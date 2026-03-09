import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";

function AppLayout() {
  return (
    <>
      <Header />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ padding: "25px", width: "100%" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppLayout;