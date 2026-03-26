const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./routes/dashboardRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reports", reportRoutes);

// 🔥 IMPORTANT: dashboard under reports
app.use("/api/reports", dashboardRoutes);

app.listen(5000, () => console.log("Server running on 5000 🚀"));