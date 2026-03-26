const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  spend: Number,
  clicks: Number,
  conversions: Number,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);