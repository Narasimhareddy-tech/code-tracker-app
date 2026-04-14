const axios = require("axios");

async function getLeetCodeStats(username) {
  try {
    const res = await axios.post("https://leetcode.com/graphql", {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username }
    });

    const stats = res.data.data.matchedUser.submitStats.acSubmissionNum;

    let easy = 0, medium = 0, hard = 0;

    stats.forEach(s => {
      if (s.difficulty === "Easy") easy = s.count;
      if (s.difficulty === "Medium") medium = s.count;
      if (s.difficulty === "Hard") hard = s.count;
    });

    return {
      easy,
      medium,
      hard,
      totalSolved: easy + medium + hard
    };

  } catch (err) {
    console.log("LC ERROR:", err.message);
    return { easy: 0, medium: 0, hard: 0, totalSolved: 0 };
  }
}

module.exports = { getLeetCodeStats };
