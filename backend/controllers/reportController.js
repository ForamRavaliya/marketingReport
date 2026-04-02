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
      .on("data", (data) => {
        console.log("CSV ROW:", data); // 🔥 DEBUG
        results.push(data);
      })
      .on("end", async () => {

        if (!results.length) {
          return res.status(400).json({ error: "CSV empty" });
        }

        for (const r of results) {

         await pool.query(
           `INSERT INTO reports
           (clientid,campaign,platform,spend,clicks,impressions,ctr,cpc,conversions,date,file,user_id)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
           [
             Number(req.body.clientId),   // 🔥 ensure number
             r.campaign,
             r.platform,
             Number(r.spend),             // 🔥 VERY IMPORTANT
             Number(r.clicks),
             Number(r.impressions),
             Number(r.ctr),
             Number(r.cpc),
             Number(r.conversions),
             new Date(),
             req.file.filename,
             req.user.id
           ]
         );
        }

        res.json({ msg: "Upload successful ✅" }); // ✅ INSIDE end
      });

  } catch (err) {
    console.log("UPLOAD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};