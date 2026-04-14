const express = require("express");
const router = express.Router(); // ✅ ADD THIS
console.log("🔥 STATS FILE RUNNING");
const getLeetCodeStats = require("../utils/leetcode");
const getCodeforcesStats = require("../utils/codeforces");
const getCodechefStats = require("../utils/codechef");

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
      try {
        lc = await getLeetCodeStats(lcUsername);
      } catch (err) {
        console.log("LC fetch failed:", err.message);
      }
    }

    // ✅ CodeChef
    if (ccUsername) {
      try {
        cc = await getCodechefStats(ccUsername);
      } catch (err) {
        console.log("CC fetch failed:", err.message);
      }
    }

    // ✅ Codeforces
    if (cfUsername) {
      try {
        cf = await getCodeforcesStats(cfUsername);
      } catch (err) {
        console.log("CF fetch failed:", err.message);
      }
    }

    // ✅ Combine stats
    const totalEasy =
      (lc.easy || 0) +
      Math.floor((cc.totalSolved || 0) * 0.4) +
      Math.floor((cf.totalSolved || 0) * 0.4);

    const totalMedium =
      (lc.medium || 0) +
      Math.floor((cc.totalSolved || 0) * 0.4) +
      Math.floor((cf.totalSolved || 0) * 0.4);

    const totalHard =
      (lc.hard || 0) +
      Math.floor((cc.totalSolved || 0) * 0.2) +
      Math.floor((cf.totalSolved || 0) * 0.2);

    const combined = {
      easy: totalEasy,
      medium: totalMedium,
      hard: totalHard,
      totalSolved: totalEasy + totalMedium + totalHard,
      rating: cc.rating || 0,
    };

    res.json({
      leetcode: lc,
      codechef: cc,
      codeforces: cf,
      combined,
      leetcodeUsername: lcUsername,
      codechefUsername: ccUsername,
      codeforcesUsername: cfUsername,
    });

  } catch (error) {
    console.error("❌ STATS ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch stats",
      details: error.message,
    });
  }
});

module.exports = router;
