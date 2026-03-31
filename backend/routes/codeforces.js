import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );

    const submissions = response.data?.result;

    // ✅ Handle invalid user
    if (!submissions) {
      return res.status(404).json({
        error: "User not found on Codeforces"
      });
    }

    const solved = new Set();

    submissions.forEach(sub => {
      if (sub.verdict === "OK") {
        solved.add(sub.problem.name);
      }
    });

    res.status(200).json({
      totalSolved: solved.size
    });

  } catch (err) {
    console.error("❌ CF ERROR:", err.message);

    res.status(500).json({
      error: "CF fetch failed",
      details: err.message
    });
  }
}
