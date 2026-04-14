const axios = require("axios");

async function getLeetCodeStats(username) {
  try {
    const res = await axios.get(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );

    return {
      easy: res.data.easySolved || 0,
      medium: res.data.mediumSolved || 0,
      hard: res.data.hardSolved || 0,
    };
  } catch (err) {
    console.log("LC ERROR:", err.message);
    return { easy: 0, medium: 0, hard: 0 };
  }
}

module.exports = getLeetCodeStats;
