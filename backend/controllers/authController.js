const jwt = require("jsonwebtoken");

// 🔐 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 TEMP: DUMMY USER (you can replace with DB later)
    if (email === "admin@gmail.com" && password === "1234") {

      const token = jwt.sign(
        { id: 1, role: "admin" },
        "secretkey",
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        role: "admin"
      });
    }

    return res.status(401).json({ msg: "Invalid credentials" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};