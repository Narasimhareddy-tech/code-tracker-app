const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const lcUsername = req.query.lc;
  const ccUsername = req.query.cc;
  const cfUsername = req.query.cf;

  try {
    let lc = { easy: 0, medium: 0, hard: 0 };
    let cc = { totalSolved: 0, rating: 0 };
    let cf = { totalSolved: 0 };

    // ✅ LeetCode
    if (lcUsername) {
      const leetcode = await axios.get(
        `http://localhost:5000/api/leetcode/${lcUsername}`
      );
      lc = leetcode.data;
    }

    // ✅ CodeChef
    if (ccUsername) {
      const codechef = await axios.get(
        `http://localhost:5000/api/codechef/${ccUsername}`
      );
      cc = codechef.data;
    }

    // ✅ Codeforces
    if (cfUsername) {
      try {
        const cfRes = await axios.get(
          `http://localhost:5000/api/codeforces/${cfUsername}`
        );
        cf = cfRes.data;
      } catch {
        console.log("CF fetch failed");
      }
    }

    const totalEasy =
  lc.easy +
  Math.floor((cc.totalSolved || 0) * 0.4) +
  Math.floor((cf.totalSolved || 0) * 0.4);

const totalMedium =
  lc.medium +
  Math.floor((cc.totalSolved || 0) * 0.4) +
  Math.floor((cf.totalSolved || 0) * 0.4);

const totalHard =
  lc.hard +
  Math.floor((cc.totalSolved || 0) * 0.2) +
  Math.floor((cf.totalSolved || 0) * 0.2);

const combined = {
  easy: totalEasy,
  medium: totalMedium,
  hard: totalHard,
  totalSolved: totalEasy + totalMedium + totalHard,
  rating: cc.rating
};

    res.json({
      leetcode: lc,
      codechef: cc,
      codeforces: cf,
      combined,
      leetcodeUsername: lcUsername,
  codechefUsername: ccUsername,
  codeforcesUsername: cfUsername
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;