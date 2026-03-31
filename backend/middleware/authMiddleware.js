const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // debug

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // Extract token from Bearer
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    // 🔥 VERY IMPORTANT: SAME SECRET USED IN LOGIN
    const decoded = jwt.verify(token, "secretkey");

    console.log("DECODED:", decoded); // debug

    req.user = decoded; // ✅ THIS IS CRITICAL

    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};