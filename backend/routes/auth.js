const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 SECRET KEY
const SECRET = "mysecretkey";


// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check existing user
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length > 0) {
      return res.status(400).json("User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await pool.query(
      "INSERT INTO users(email,password) VALUES($1,$2)",
      [email, hashedPassword]
    );

    res.json("Registered successfully ✅");

  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json("User not found ❌");
    }

    const valid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!valid) {
      return res.status(401).json("Invalid password ❌");
    }

    // create token
    const token = jwt.sign(
      { id: user.rows[0].id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: user.rows[0]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;