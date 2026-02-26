import { useAuth } from "../features/auth/authContext";
import Sidebar from "../components/Sidebar";

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f3f4f6" }}>
        {/* Top Header */}
        <div
          style={{
            height: "60px",
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          <div style={{ fontWeight: "600", fontSize: "18px" }}>
            Gym Coordination System
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontWeight: "500" }}>
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="button button-danger"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "30px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;