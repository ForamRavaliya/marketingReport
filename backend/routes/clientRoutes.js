const router = require("express").Router();

const {
  createClient,
  getClients,
  deleteClient
} = require("../controllers/clientController");

router.post("/", createClient);
router.get("/", getClients);
router.delete("/:id", deleteClient);

module.exports = router;