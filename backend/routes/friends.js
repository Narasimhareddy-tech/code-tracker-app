const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");

// ➕ SEND REQUEST
router.post("/send-request", async (req, res) => {
  console.log("🔥 SEND REQUEST HIT");

  let { from, to } = req.body;

  try {
    // ✅ FIX: if frontend sends full object, extract username
    if (typeof from === "object") from = from.username;

    console.log("FROM:", from);
    console.log("TO:", to);

    const receiver = await User.findOne({ username: to });

    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ prevent duplicates
    if (!receiver.requests.includes(from)) {
      receiver.requests.push(from);
    }

    await receiver.save();

    console.log("✅ REQUEST SAVED:", receiver.requests);

    res.json({ message: "Request sent" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Failed to send request" });
  }
});


// 📥 GET REQUESTS
router.get("/requests/:username", async (req, res) => {
  try {
    const username = req.params.username;

    console.log("📥 FETCH REQUESTS FOR:", username);

    const user = await User.findOne({ username });

    if (!user) return res.json([]);

    // ✅ CLEAN BAD DATA (IMPORTANT)
    const cleanedRequests = user.requests.map((r) => {
      try {
        // if it's JSON string → extract username
        if (r.startsWith("{")) {
          return JSON.parse(r).username;
        }
        return r;
      } catch {
        return r;
      }
    });

    res.json(cleanedRequests);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching requests" });
  }
});


// ✅ ACCEPT REQUEST
router.post("/accept-request", async (req, res) => {
  let { from, to } = req.body;

  try {
    if (typeof from === "object") from = from.username;

    console.log("✅ ACCEPT HIT:", from, to);

    const user = await User.findOne({ username: to });
    const sender = await User.findOne({ username: from });

    if (!user || !sender) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ FIX: CLEAN + REMOVE properly
    user.requests = user.requests
      .map(r => {
        try {
          if (r.startsWith("{")) return JSON.parse(r).username;
          return r;
        } catch {
          return r;
        }
      })
      .filter(r => r !== from);

    // ✅ add friends
    if (!user.friends.includes(from)) user.friends.push(from);
    if (!sender.friends.includes(to)) sender.friends.push(to);

    await user.save();
    await sender.save();

    res.json({ message: "Request accepted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept request" });
  }
});


// 👥 GET FRIENDS LIST
router.get("/list/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) return res.json([]);

    res.json(user.friends || []);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});


// 🏆 LEADERBOARD
router.get("/leaderboard/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) return res.json([]);

    const friends = user.friends || [];

    let leaderboard = [];

    for (let friend of friends) {
      try {
        const f = await User.findOne({ username: friend });

        if (!f) continue; // ✅ safety

        const statsRes = await axios.get(
          `http://localhost:5000/api/stats?lc=${f.lcUsername}&cc=${f.ccUsername}&cf=${f.cfUsername}`
        );

        leaderboard.push({
          username: friend,
          total: statsRes.data?.combined?.totalSolved || 0
        });

      } catch (err) {
        console.log("Failed for", friend);
      }
    }

    // sort descending
    leaderboard.sort((a, b) => b.total - a.total);

    res.json(leaderboard);

  } catch (err) {
    res.status(500).json({ error: "Leaderboard failed" });
  }
});

module.exports = router;