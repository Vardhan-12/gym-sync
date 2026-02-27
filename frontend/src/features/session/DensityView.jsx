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
  LineChart,
  Line,
} from "recharts";

const DensityView = () => {
  const [date, setDate] = useState("");
  const [density, setDensity] = useState([]);
  const [weekly, setWeekly] = useState([]);

  // ================= FETCH DENSITY =================
  useEffect(() => {
    if (!date) return;

    const loadData = async () => {
      try {
        const res = await axios.get("/sessions/density", {
          params: { date },
        });
        setDensity(res.data);
      } catch (err) {
        console.error("Density fetch error:", err);
      }
    };

    loadData();
  }, [date]);

  // ================= FETCH WEEKLY =================
  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await axios.get("/sessions/weekly-summary");
        setWeekly(res.data);
      } catch (err) {
        console.error("Weekly fetch error:", err);
      }
    };

    fetchWeekly();
  }, []);

  // ================= ANALYTICS =================
  const getPeakSlot = () =>
    density.reduce((max, slot) =>
      slot.count > max.count ? slot : max,
    density[0] || {});

  const getBestTimeSlot = () =>
    density.reduce((min, slot) =>
      slot.count < min.count ? slot : min,
    density[0] || {});

  const getPredictedNext = () => {
    if (density.length < 3) return null;
    const lastThree = density.slice(-3);
    const sum = lastThree.reduce((acc, s) => acc + s.count, 0);
    return Math.round(sum / 3);
  };

  const chartData = density.map((slot) => ({
    time: new Date(slot.windowStart).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    users: slot.count,
  }));

  return (
    <div className="container fade-in">

      {/* Controls */}
      <div className="card">
        <div className="section-title">Select Date</div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        />
      </div>

      {date && (
        <>
          {/* Summary */}
          <div className="card" style={{ marginTop: "30px" }}>
            <div className="section-title">Analytics Summary</div>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <SummaryItem
                label="Peak"
                value={
                  getPeakSlot().windowStart
                    ? new Date(getPeakSlot().windowStart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"
                }
              />
              <SummaryItem
                label="Best Time"
                value={
                  getBestTimeSlot().windowStart
                    ? new Date(getBestTimeSlot().windowStart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"
                }
              />
              <SummaryItem
                label="Prediction"
                value={
                  getPredictedNext() !== null
                    ? `${getPredictedNext()} users`
                    : "-"
                }
              />
            </div>
          </div>

          {/* Bar Chart */}
          {density.length > 0 && (
            <div className="card" style={{ marginTop: "30px" }}>
              <div className="section-title">Daily Density Chart</div>
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

          {/* Weekly Trend */}
          {weekly.length > 0 && (
            <div className="card" style={{ marginTop: "30px" }}>
              <div className="section-title">7-Day Trend</div>
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
        </>
      )}
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div>
    <div style={{ fontSize: "13px", color: "#64748b" }}>{label}</div>
    <div style={{ fontSize: "16px", fontWeight: "600" }}>{value}</div>
  </div>
);

export default DensityView;