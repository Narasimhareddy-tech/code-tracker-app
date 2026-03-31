import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { username } = req.query;

  try {
    const { data } = await axios.get(
      `https://www.codechef.com/users/${username}`
    );

    const $ = cheerio.load(data);

    // ✅ Problems solved
    const problemsSolvedText = $("section.problems-solved h5").text();

    let totalSolved = 0;

    if (problemsSolvedText) {
      const match = problemsSolvedText.match(/\d+/);
      if (match) totalSolved = parseInt(match[0]);
    }

    // ✅ Rating
    const ratingText = $(".rating-number").first().text();
    const rating = parseInt(ratingText) || 0;

    res.status(200).json({
      totalSolved,
      rating
    });

  } catch (error) {
    console.error("❌ CodeChef ERROR:", error.message);

    res.status(500).json({
      error: "Failed to fetch CodeChef data",
      details: error.message
    });
  }
}
