export default function handler(req, res) {
  const { lc, cc, cf } = req.query;

  return res.status(200).json({
    leetcode: { easy: 10, medium: 20, hard: 5 },
    codechef: { totalSolved: 50, rating: 1500 },
    codeforces: { totalSolved: 999 },
    combined: {
      easy: 10,
      medium: 20,
      hard: 5,
      totalSolved: 35,
      rating: 1500,
    },
    leetcodeUsername: lc,
    codechefUsername: cc,
    codeforcesUsername: cf,
  });
}
