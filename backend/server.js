const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// 🔥 MIDDLEWARE
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// 🔥 CONNECT DB
connectDB();

// 🔥 ROUTES
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

// 🔥 TEST ROUTE
//app.get("/", (req, res) => {
 // res.send("CodeTracker API running");
//});

// 🔥 SERVE FRONTEND (React build)
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// 🔥 PORT (IMPORTANT FOR DEPLOYMENT)
//const PORT = process.env.PORT || 3000;

// 🔥 START SERVER
//app.listen(PORT, () => {
 // console.log(`Server running on port ${PORT}`);
//});
