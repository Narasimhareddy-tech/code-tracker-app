const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// SEND MESSAGE
router.post("/send", async (req, res) => {
  const { from, to, text } = req.body;

  try {
    const msg = new Message({ from, to, text });
    await msg.save();

    res.json({ message: "Sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

// GET CHAT
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;