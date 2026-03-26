const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const clients = await pool.query(
      "SELECT COUNT(*) FROM clients WHERE user_id = $1",
      [userId]
    );

    const totals = await pool.query(`
      SELECT
        COALESCE(SUM(spend),0) AS spend,
        COALESCE(SUM(clicks),0) AS clicks,
        COALESCE(SUM(conversions),0) AS conversions
      FROM reports
      WHERE user_id = $1
    `, [userId]);

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