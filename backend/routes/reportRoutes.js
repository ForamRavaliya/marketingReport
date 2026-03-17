const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");

// ⚠ remove mongoose model if postgres use karo
// const Report = require("../models/Report");

const upload = multer({ dest: "uploads/" });

/* ===============================
   UPLOAD CSV + SAVE DATA
================================ */
router.post("/upload", upload.single("file"), async (req, res) => {

  try {

    if (!req.file)
      return res.status(400).json({ error: "File not uploaded" });

    if (!req.body.clientId)
      return res.status(400).json({ error: "ClientId missing" });

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {

        if (results.length === 0)
          return res.status(400).json({ error: "CSV empty" });

        /* ===============================
           👉 POSTGRES INSERT HERE
           (example dummy response now)
        =============================== */

        // TODO: insert into postgres using pool.query()

        res.json({
          msg: "Uploaded & Parsed",
          rows: results.length
        });
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Upload failed" });
  }

});


/* ===============================
   DASHBOARD API (VERY IMPORTANT)
================================ */
router.get("/dashboard", async (req, res) => {

  try {

    // 👉 temporary dummy data (test first)
    res.json({
      clients: 5,
      spend: 25000,
      clicks: 4300,
      conversions: 180
    });

  } catch (err) {
    res.status(500).json({ error: "Dashboard error" });
  }

});

module.exports = router;