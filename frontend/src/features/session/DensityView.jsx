import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";

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
    fetchDensity();
  }, [date]);

  const getColor = (count) => {
    if (count === 0) return "#e0e0e0";
    if (count < 3) return "#a5d6a7";
    if (count < 6) return "#66bb6a";
    return "#2e7d32";
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Gym Density Heatmap</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "8px",
          marginTop: "20px",
        }}
      >
        {density.map((slot, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              textAlign: "center",
              borderRadius: "6px",
              backgroundColor: getColor(slot.count),
              fontSize: "12px",
            }}
          >
            <div>
              {new Date(slot.windowStart).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <strong>{slot.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DensityView;