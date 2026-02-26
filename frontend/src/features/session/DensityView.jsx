import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  LineChart,
  Line,
} from "recharts";

const DensityView = () => {
  const [date, setDate] = useState("");
  const [density, setDensity] = useState([]);

  const fetchDensity = async () => {
    if (!date) return;

    try {
      const res = await axios.get("/sessions/density", {
        params: { date },
      });
      setDensity(res.data);
    } catch (err) {
      console.error("Density fetch error:", err);
    }
  };

useEffect(() => {
  if (!date) return;

  let isMounted = true;

  const loadData = async () => {
    try {
      const res = await axios.get("/sessions/density", {
        params: { date },
      });

      if (isMounted) {
        setDensity(res.data);
      }
    } catch (err) {
      console.error("Density fetch error:", err);
    }
  };

  // First immediate fetch
  loadData();

  // Poll every 30 seconds
  const interval = setInterval(loadData, 30000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, [date]);

  const getColor = (count) => {
    if (count === 0) return "#e5e7eb";
    if (count === 1) return "#bfdbfe";
    if (count <= 3) return "#60a5fa";
    if (count <= 5) return "#2563eb";
    return "#1e3a8a";
  };

  const getTodayStatus = () => {
    if (!density.length) return "No Data";

    const max = Math.max(...density.map((d) => d.count));

    if (max === 0) return "Empty";
    if (max <= 3) return "Low Crowd";
    if (max <= 6) return "Moderate";
    return "High Crowd";
  };

  const getPeakSlot = () => {
  if (!density.length) return null;

  let peak = density[0];

  for (let i = 1; i < density.length; i++) {
    if (density[i].count > peak.count) {
      peak = density[i];
    }
  }

  return peak;
};

const getBestTimeSlot = () => {
  if (!density.length) return null;

  const filtered = density.filter((slot) => {
    const hour = new Date(slot.windowStart).getHours();
    return hour >= 6 && hour <= 22;
  });

  if (!filtered.length) return null;

  let best = filtered[0];

  for (let i = 1; i < filtered.length; i++) {
    if (filtered[i].count < best.count) {
      best = filtered[i];
    }
  }

  return best;
};

const chartData = density.map((slot) => ({
  time: new Date(slot.windowStart).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  users: slot.count,
}));

const getTrend = () => {
  if (density.length < 2) return null;

  const last = density[density.length - 1];
  const prev = density[density.length - 2];

  if (last.count > prev.count) return "Increasing";
  if (last.count < prev.count) return "Decreasing";
  return "Stable";
};

const getPredictedNext = () => {
  if (density.length < 3) return null;

  const lastThree = density.slice(-3);

  const sum = lastThree.reduce((acc, slot) => acc + slot.count, 0);

  const avg = Math.round(sum / lastThree.length);

  return avg;
};

  const getStatusStyle = () => {
    const status = getTodayStatus();

    if (status === "High Crowd") {
      return { background: "#fee2e2", color: "#991b1b" };
    }
    if (status === "Moderate") {
      return { background: "#fef3c7", color: "#92400e" };
    }
    if (status === "Low Crowd") {
      return { background: "#d1fae5", color: "#065f46" };
    }
    return { background: "#e5e7eb", color: "#374151" };
  };

  const [weekly, setWeekly] = useState([]);

const fetchWeekly = async () => {
  try {
    const res = await axios.get("/sessions/weekly-summary");
    setWeekly(res.data);
  } catch (err) {
    console.error("Weekly fetch error:", err);
  }
};

useEffect(() => {
  fetchWeekly();
}, []);

  return (
    <div style={{ marginTop: "50px" }}>
      <h3 style={{ marginBottom: "15px" }}>
        Gym Density Heatmap
      </h3>

      {/* Date Picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          background: "white",
        }}
      />

        <div
  style={{
    marginTop: "15px",
    fontSize: "12px",
    color: "#6b7280",
  }}
>
  Live updates every 30 seconds
</div>

      {/* Status Badge */}
      {date && (
        <div
          style={{
            marginTop: "15px",
            padding: "8px 14px",
            borderRadius: "20px",
            display: "inline-block",
            fontSize: "13px",
            fontWeight: "600",
            ...getStatusStyle(),
          }}
        >
          Status: {getTodayStatus()}
        </div>
      )}

      {date && getPeakSlot() && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "10px",
      background: "#eef2ff",
      color: "#3730a3",
      fontWeight: "500",
    }}
  >
    Peak Hour:{" "}
    {new Date(getPeakSlot().windowStart).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}{" "}
    — {getPeakSlot().count} active users
  </div>
)}

    {date && getBestTimeSlot() && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px",
      borderRadius: "10px",
      background: "#ecfdf5",
      color: "#065f46",
      fontWeight: "500",
    }}
  >
    Recommended Time To Visit:{" "}
    {new Date(getBestTimeSlot().windowStart).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}{" "}
    — Only {getBestTimeSlot().count} active users
  </div>
)}

      {/* Legend */}
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "15px",
          fontSize: "13px",
          alignItems: "center",
        }}
      >
        <Legend color="#e5e7eb" label="0" />
        <Legend color="#bfdbfe" label="1" />
        <Legend color="#60a5fa" label="2-3" />
        <Legend color="#2563eb" label="4-5" />
        <Legend color="#1e3a8a" label="6+" />
      </div>

      {/* Empty State */}
      {density.length === 0 && date && (
        <div style={{ marginTop: "20px", color: "#6b7280" }}>
          No sessions for selected date.
        </div>
      )}

      {date && getTrend() && (
  <div
    style={{
      marginTop: "12px",
      padding: "10px 14px",
      borderRadius: "8px",
      fontWeight: "500",
      background:
        getTrend() === "Increasing"
          ? "#fee2e2"
          : getTrend() === "Decreasing"
          ? "#d1fae5"
          : "#f3f4f6",
      color:
        getTrend() === "Increasing"
          ? "#991b1b"
          : getTrend() === "Decreasing"
          ? "#065f46"
          : "#374151",
    }}
  >
    Crowd Trend: {getTrend()}
  </div>
)}

{date && getPredictedNext() !== null && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px 14px",
      borderRadius: "10px",
      background: "#eef2ff",
      color: "#3730a3",
      fontWeight: "500",
    }}
  >
    Predicted Next Slot Crowd: {getPredictedNext()} users
  </div>
)}

      {/* Heatmap Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px",
          marginTop: "25px",
        }}
      >
        {density.map((slot, index) => (
          <div
            key={index}
            style={{
              padding: "15px",
              textAlign: "center",
              borderRadius: "10px",
              backgroundColor: getColor(slot.count),
              fontSize: "13px",
              fontWeight: "500",
              color: slot.count > 0 ? "white" : "#444",
              transition: "0.2s ease",
              cursor: "pointer",
            }}
          >
            <div>
              {new Date(slot.windowStart).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div style={{ marginTop: "5px", fontSize: "14px" }}>
              {slot.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  {density.length > 0 && (
  <div
    style={{
      marginTop: "50px",
      padding: "20px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h3 style={{ marginBottom: "20px" }}>
      Density Analytics Chart
    </h3>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

{weekly.length > 0 && (
  <div
    style={{
      marginTop: "50px",
      padding: "20px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h3 style={{ marginBottom: "20px" }}>
      7-Day Session Trend
    </h3>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={weekly}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalSessions"
          stroke="#2563eb"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

};

const Legend = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <div
      style={{
        width: "20px",
        height: "20px",
        background: color,
        borderRadius: "4px",
      }}
    />
    <span>{label}</span>
  </div>
);

export default DensityView;