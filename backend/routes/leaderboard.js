const express = require("express");
const router = express.Router();

// import utils (we will create these)
const { getLeetcodeStats } = require("../utils/leetcode");

// TEMP friends list (you can move to DB later)
const friends = [
  { name: "Arpit", leetcode: "your_leetcode_username" },
  { name: "Friend1", leetcode: "friend_username" }
];

router.get("/", async (req, res) => {
  try {
    const leaderboard = [];

    for (let friend of friends) {
      let totalSolved = 0;

      if (friend.leetcode) {
        const lc = await getLeetcodeStats(friend.leetcode);
        totalSolved = lc.totalSolved || 0;
      }

      leaderboard.push({
        name: friend.name,
        totalSolved
      });
    }

    // sort descending
    leaderboard.sort((a, b) => b.totalSolved - a.totalSolved);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

module.exports = router;
