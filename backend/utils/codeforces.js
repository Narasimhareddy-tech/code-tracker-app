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

    res.data.result.forEach(sub => {
      if (sub.verdict === "OK") {
        const id = sub.problem.contestId + "-" + sub.problem.index;
        solvedSet.add(id);
      }
    });

    return {
      totalSolved: solvedSet.size,
    };

  } catch (err) {
    console.log("CF ERROR:", err.message);
    return { totalSolved: 0 };
  }
}

module.exports = getCodeforcesStats;
