const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    const submissions = response.data.result;

    const solved = new Set();

    submissions.forEach(sub => {
      if (sub.verdict === "OK") {
        solved.add(sub.problem.name);
      }
    });

    res.json({
      totalSolved: solved.size
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "CF fetch failed" });
  }
});

module.exports = router;