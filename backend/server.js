const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboardRoutes");

const clientRoutes = require("./routes/clientRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/clients", clientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(5000, () => console.log("Server running on 5000"));