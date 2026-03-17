const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const clients = await pool.query("SELECT COUNT(*) FROM clients");

    const totals = await pool.query(`
      SELECT
        COALESCE(SUM(spend),0) AS spend,
        COALESCE(SUM(clicks),0) AS clicks,
        COALESCE(SUM(conversions),0) AS conversions
      FROM reports
    `);

    res.json({
      clients: Number(clients.rows[0].count),
      spend: Number(totals.rows[0].spend),
      clicks: Number(totals.rows[0].clicks),
      conversions: Number(totals.rows[0].conversions),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};