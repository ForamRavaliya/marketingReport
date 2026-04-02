const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {

    const { from, to, clientId, campaign } = req.query;

    let baseCondition = "";
    let params = [];
    let index = 1;

    // 🔥 ROLE CHECK
    if (req.user.role === "client") {
      // 👤 CLIENT → only their own data
      baseCondition = `clientid = $1`;
      params.push(req.user.id);
      index = 2;
    } else {
      // 👨‍💼 ADMIN → all their clients
      baseCondition = `
        clientid IN (
          SELECT id FROM clients WHERE user_id = $1
        )
      `;
      params.push(req.user.id);
      index = 2;
    }

    // 🔥 MAIN QUERY
    let query = `
      SELECT
        COALESCE(SUM(spend),0) AS spend,
        COALESCE(SUM(clicks),0) AS clicks,
        COALESCE(SUM(conversions),0) AS conversions
      FROM reports
      WHERE ${baseCondition}
    `;

    // ✅ CLIENT FILTER (only for admin)
    if (clientId && clientId !== "All" && req.user.role !== "client") {
      query += ` AND clientid = $${index}`;
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

    const totals = await pool.query(query, params);

    // 🔥 CLIENT COUNT (admin vs client)
    let clientCount = 1;

    if (req.user.role !== "client") {
      const clients = await pool.query(
        "SELECT COUNT(*) FROM clients WHERE user_id = $1",
        [req.user.id]
      );
      clientCount = Number(clients.rows[0].count);
    }

    // 🔥 CHART QUERY
    let chartQuery = `
      SELECT date, SUM(clicks) as clicks
      FROM reports
      WHERE ${baseCondition}
      GROUP BY date
      ORDER BY date ASC
      LIMIT 7
    `;

    const chartData = await pool.query(chartQuery, params.slice(0, 1));

    res.json({
      clients: clientCount,
      spend: Number(totals.rows[0].spend),
      clicks: Number(totals.rows[0].clicks),
      conversions: Number(totals.rows[0].conversions),
      chart: chartData.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};