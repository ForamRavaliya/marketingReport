const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const pool = require("../config/db");

const upload = multer({ dest: "uploads/" });

/* ===============================
   UPLOAD CSV + SAVE DATA
================================ */
router.post("/upload", auth, upload.single("file"), async (req, res) => {

  try {
    const userId = req.user.id;

    if (!req.file)
      return res.status(400).json({ error: "File not uploaded" });

    if (!req.body.clientId)
      return res.status(400).json({ error: "ClientId missing" });

    const clientId = req.body.clientId;
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {

        if (results.length === 0)
          return res.status(400).json({ error: "CSV empty" });

        // ✅ INSERT EACH ROW
        for (let row of results) {
          await pool.query(
            `INSERT INTO reports (client_id, user_id, spend, clicks, conversions)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              clientId,
              userId,
              row.spend || 0,
              row.clicks || 0,
              row.conversions || 0
            ]
          );
        }

        res.json({
          msg: "Uploaded & Saved ✅",
          rows: results.length
        });
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }

});

module.exports = router;