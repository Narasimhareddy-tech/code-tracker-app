const express = require("express");
const axios = require("axios");

const router = express.Router();

// ✅ Auto-detect base URL (works on Vercel + local)
const BASE_URL =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:5000";

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
        const leetcode = await axios.get(
          `${BASE_URL}/api/leetcode/${lcUsername}`
        );
        lc = leetcode.data;
      } catch (err) {
        console.log("LC fetch failed:", err.message);
      }
    }

    // ✅ CodeChef
    if (ccUsername) {
      try {
        const codechef = await axios.get(
          `${BASE_URL}/api/codechef/${ccUsername}`
        );
        cc = codechef.data;
      } catch (err) {
        console.log("CC fetch failed:", err.message);
      }
    }

    // ✅ Codeforces
    if (cfUsername) {
      try {
        const cfRes = await axios.get(
          `${BASE_URL}/api/codeforces/${cfUsername}`
        );
        cf = cfRes.data;
      } catch (err) {
        console.log("CF fetch failed:", err.message);
      }
    }

    // ✅ Combine stats safely
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
      details: error.message, // 🔥 helps debugging
    });
  }
});

module.exports = router;
