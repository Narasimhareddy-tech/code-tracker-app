const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🔧 UPDATE USER SETTINGS
router.put("/update", async (req, res) => {
  const { username, lcUsername, ccUsername, cfUsername, avatar } = req.body;

  console.log("UPDATE HIT:", username);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.lcUsername = lcUsername || "";
    user.ccUsername = ccUsername || "";
    user.cfUsername = cfUsername || "";

    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});


// 👤 GET USER DATA
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

module.exports = router;