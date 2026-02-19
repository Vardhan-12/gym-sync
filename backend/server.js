require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.get("/api/test", (req, res) => {
  res.json({ message: "GymSync backend running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
