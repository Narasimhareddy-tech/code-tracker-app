const axios = require("axios");

async function getCodeforcesStats(username) {
  try {
    const res = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    if (res.data.status !== "OK") {
      return { totalSolved: 0 };
    }

    const solvedSet = new Set();

    for (const sub of res.data.result) {
      if (sub.verdict === "OK") {
        const id = sub.problem.contestId + "-" + sub.problem.index;
        solvedSet.add(id);
      }
    }

    console.log("CF SOLVED COUNT:", solvedSet.size); // 🔥 DEBUG

    return {
      totalSolved: solvedSet.size,
    };

  } catch (err) {
    console.log("CF ERROR:", err.message);
    return { totalSolved: 0 };
  }
}

module.exports = getCodeforcesStats;
