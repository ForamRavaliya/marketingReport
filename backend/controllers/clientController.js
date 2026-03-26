const pool = require("../config/db");

const Client = require("../models/Client");

// ➕ ADD CLIENT (userId save)
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create({
      name: req.body.name,
      email: req.body.email,
      userId: req.user.id   // 🔥 IMPORTANT
    });

    res.json(client);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 📥 GET ONLY USER'S CLIENTS
//const pool = require("../config/db");

exports.getClients = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const result = await pool.query(
      "SELECT * FROM clients WHERE user_id = $1",
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE (only own client)
exports.deleteClient = async (req, res) => {
  try {
    await Client.deleteOne({
      _id: req.params.id,
      userId: req.user.id   // 🔥 SECURITY
    });

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};