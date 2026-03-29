const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const { data } = await axios.get(
      `https://www.codechef.com/users/${username}`
    );

    const $ = cheerio.load(data);

    // Problems solved (approx)
    const problemsSolvedText = $("section.problems-solved h5").text();

    let totalSolved = 0;

    if (problemsSolvedText) {
      const match = problemsSolvedText.match(/\d+/);
      if (match) totalSolved = parseInt(match[0]);
    }

    // Rating
    const rating = $(".rating-number").text();

    res.json({
      totalSolved,
      rating: parseInt(rating) || 0
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
});

module.exports = router;