const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  createClient,
  getClients,
  deleteClient
} = require("../controllers/clientController");

// 🔐 PROTECTED ROUTES
router.post("/", auth, createClient);
router.get("/", auth, getClients);
router.delete("/:id", auth, deleteClient);

module.exports = router;