const axios = require("axios");

async function getCodeforcesStats(username) {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    const solved = new Set(
      res.data.result.map(q => q.problem.contestId + "-" + q.problem.index)
    );

    return {
      totalSolved: solved.size,
    };
  } catch (err) {
    console.log("CF ERROR:", err.message);
    return { totalSolved: 0 };
  }
}

module.exports = getCodeforcesStats;
