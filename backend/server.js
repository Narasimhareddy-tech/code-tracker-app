const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

connectDB();

const leetcodeRoute = require("./routes/leetcode");
app.use("/api/leetcode", leetcodeRoute);

const codechefRoute = require("./routes/codechef");
app.use("/api/codechef", codechefRoute);

const statsRoute = require("./routes/stats");
app.use("/api/stats", statsRoute);

const chatRoute = require("./routes/chat");
app.use("/api/chat", chatRoute);

const friendsRoute = require("./routes/friends");
app.use("/api/friends", friendsRoute);

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const userRoute = require("./routes/user");
app.use("/api/user", userRoute);

const cfRoute = require("./routes/codeforces");
app.use("/api/codeforces", cfRoute);

app.get("/", (req, res) => {
  res.send("CodeTracker API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
