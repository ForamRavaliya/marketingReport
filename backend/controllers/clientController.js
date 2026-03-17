const pool = require("../config/db");

exports.createClient = async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO clients(name,email) VALUES($1,$2) RETURNING *",
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    await pool.query("DELETE FROM clients WHERE id=$1", [req.params.id]);
    res.json({ msg: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};