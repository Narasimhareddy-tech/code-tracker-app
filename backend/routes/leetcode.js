import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
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
      }
    );

    const user = response.data?.data?.matchedUser;

    // ✅ Handle invalid username
    if (!user) {
      return res.status(404).json({
        error: "User not found on LeetCode"
      });
    }

    const stats = user.submitStats.acSubmissionNum;

    let result = { easy: 0, medium: 0, hard: 0 };

    stats.forEach(item => {
      if (item.difficulty === "Easy") result.easy = item.count;
      if (item.difficulty === "Medium") result.medium = item.count;
      if (item.difficulty === "Hard") result.hard = item.count;
    });

    res.status(200).json(result);

  } catch (error) {
    console.error("❌ LC ERROR:", error.message);

    res.status(500).json({
      error: "Failed to fetch LeetCode data",
      details: error.message
    });
  }
}
