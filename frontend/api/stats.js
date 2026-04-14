export default async function handler(req, res) {
  const { lc, cc, cf } = req.query;

  let leetcode = { easy: 0, medium: 0, hard: 0 };
  let codeforces = { totalSolved: 0 };
  let codechef = { totalSolved: 0, rating: 0 };

  try {
    // 🔥 LEETCODE (GraphQL)
    if (lc) {
      try {
        const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            variables: { username: lc }
          })
        });

        const data = await response.json();

        const stats =
          data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];

        stats.forEach(s => {
          if (s.difficulty === "Easy") leetcode.easy = s.count;
          if (s.difficulty === "Medium") leetcode.medium = s.count;
          if (s.difficulty === "Hard") leetcode.hard = s.count;
        });

      } catch (err) {
        console.log("LC ERROR:", err.message);
      }
    }

    // 🔥 CODEFORCES (REAL API)
    if (cf) {
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.status?handle=${cf}`
        );

        const data = await response.json();

        if (data.status === "OK") {
          const solvedSet = new Set();

          data.result.forEach(sub => {
            if (sub.verdict === "OK") {
              const id = sub.problem.contestId + "-" + sub.problem.index;
              solvedSet.add(id);
            }
          });

          codeforces.totalSolved = solvedSet.size;
        }

      } catch (err) {
        console.log("CF ERROR:", err.message);
      }
    }

    // ⚠️ CODECHEF (basic for now)
    if (cc) {
      codechef = {
        totalSolved: 0,
        rating: 0
      };
    }

    // 🔥 COMBINE
    const combined = {
      easy:
        leetcode.easy +
        Math.floor(codeforces.totalSolved * 0.4),

      medium:
        leetcode.medium +
        Math.floor(codeforces.totalSolved * 0.4),

      hard:
        leetcode.hard +
        Math.floor(codeforces.totalSolved * 0.2),

      totalSolved:
        leetcode.easy +
        leetcode.medium +
        leetcode.hard +
        codeforces.totalSolved,

      rating: codechef.rating
    };

    return res.status(200).json({
      leetcode,
      codeforces,
      codechef,
      combined,
      leetcodeUsername: lc,
      codeforcesUsername: cf,
      codechefUsername: cc
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed",
      details: err.message
    });
  }
}
