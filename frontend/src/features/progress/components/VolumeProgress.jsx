import { useEffect, useState } from "react";
import { getVolumeProgress } from "../../workout/workoutService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function VolumeProgress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVolumeProgress();
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Volume Progress</h3>

      {data.length > 0 && (
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) =>
              new Date(d).toLocaleDateString()
            }
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalVolume" />
        </LineChart>
      )}
    </div>
  );
}

export default VolumeProgress;