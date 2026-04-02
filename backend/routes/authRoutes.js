const router = require("express").Router();
const { clientLogin , clientRegister } = require("../controllers/authController");

// ✅ CLIENT LOGIN ROUTE
router.post("/client-login", clientLogin);
router.post("/client-register", clientRegister);

module.exports = router;