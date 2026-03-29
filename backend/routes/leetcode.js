const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
        `,
        variables: { username }
      }
    );

    const stats = response.data.data.matchedUser.submitStats.acSubmissionNum;

    let result = { easy: 0, medium: 0, hard: 0 };

    stats.forEach(item => {
      if (item.difficulty === "Easy") result.easy = item.count;
      if (item.difficulty === "Medium") result.medium = item.count;
      if (item.difficulty === "Hard") result.hard = item.count;
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
});

module.exports = router;