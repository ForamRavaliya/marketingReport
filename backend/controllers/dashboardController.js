const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 FILTERS FROM FRONTEND
    const { from, to, clientId, campaign } = req.query;

    let query = `
      SELECT
        COALESCE(SUM(spend),0) AS spend,
        COALESCE(SUM(clicks),0) AS clicks,
        COALESCE(SUM(conversions),0) AS conversions
      FROM reports
      WHERE user_id = $1
    `;

    let params = [userId];
    let index = 2;

    // ✅ CLIENT FILTER
    if (clientId && clientId !== "All") {
      query += ` AND client_id = $${index}`;
      params.push(clientId);
      index++;
    }

    // ✅ DATE FILTER
    if (from && to) {
      query += ` AND date BETWEEN $${index} AND $${index + 1}`;
      params.push(from, to);
      index += 2;
    }

    // ✅ CAMPAIGN FILTER
    if (campaign && campaign !== "All") {
      query += ` AND campaign = $${index}`;
      params.push(campaign);
      index++;
    }

    // 🔥 TOTAL DATA
    const totals = await pool.query(query, params);

    // 🔥 CLIENT COUNT
    const clients = await pool.query(
      "SELECT COUNT(*) FROM clients WHERE user_id = $1",
      [userId]
    );

    // 🔥 CHART DATA (GROUP BY DATE)
    const chartQuery = `
      SELECT date, SUM(clicks) as clicks
      FROM reports
      WHERE user_id = $1
      GROUP BY date
      ORDER BY date ASC
      LIMIT 7
    `;

    const chartData = await pool.query(chartQuery, [userId]);

    res.json({
      clients: Number(clients.rows[0].count),
      spend: Number(totals.rows[0].spend),
      clicks: Number(totals.rows[0].clicks),
      conversions: Number(totals.rows[0].conversions),
      chart: chartData.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};