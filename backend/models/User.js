const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,

  lcUsername: { type: String, default: "" },
  ccUsername: { type: String, default: "" },
  gfgUsername: { type: String, default: "" },
  hrUsername: { type: String, default: "" },
  cfUsername: { type: String, default: "" },

  friends: {
    type: [String],
    default: []
  },

  requests: {
    type: [String],
    default: []
  },

  avatar: {
    type: String,
    default: "avatar1"
  }
});

module.exports = mongoose.model("User", userSchema);