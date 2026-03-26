const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: String,
  email: String,

  // 🔥 ADD THIS (IMPORTANT)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", ClientSchema);