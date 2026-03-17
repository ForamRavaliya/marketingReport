const pool = require("../config/db");
const fs = require("fs");
const csv = require("csv-parser");

exports.uploadReport = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "CSV file required" });
  }

  const results = [];

  try {

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {

        if (!results.length) {
          return res.status(400).json({ error: "CSV empty" });
        }

        for (const r of results) {

          await pool.query(
            `INSERT INTO reports
            (clientid,campaign,platform,spend,clicks,impressions,ctr,cpc,conversions,date,file)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
              req.body.clientId,
              r.Campaign,
              r.Platform,
              r.Spend,
              r.Clicks,
              r.Impressions,
              r.CTR,
              r.CPC,
              r.Conversions,
              new Date(),
              req.file.filename
            ]
          );
        }

        res.json({ msg: "Upload successful" });
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};