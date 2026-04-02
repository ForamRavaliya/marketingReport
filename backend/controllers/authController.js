const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ✅ CLIENT LOGIN
exports.clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 find client
    const result = await pool.query(
      "SELECT * FROM clients WHERE email = $1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(400).json({ msg: "Client not found" });
    }

    const client = result.rows[0];

    // 🔍 DEBUG
    console.log("Entered Password:", password);
    console.log("DB Hash:", client.password);

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, client.password);

    console.log("Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // 🔑 token
    const token = jwt.sign(
      { id: client.user_id, role: "client" },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token, role: "client" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.clientRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 CHECK IF EXISTS
    const check = await pool.query(
      "SELECT * FROM clients WHERE email = $1",
      [email]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ msg: "CLIENT EXISTS ❌" });
    }

    // 🔐 hash password
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO clients (name, email, password, user_id)
       VALUES ($1, $2, $3, $4)`,
      [name, email, hashed, 1]
    );

   res.json({ msg: "CLIENT REGISTER SUCCESS ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};