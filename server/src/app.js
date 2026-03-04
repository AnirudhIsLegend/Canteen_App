const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// PUBLIC routes
app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend running" });
});

// PROTECTED routes
app.use("/api/profile", profileRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;

