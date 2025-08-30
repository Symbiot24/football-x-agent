const axios = require("axios");

const NEWS_API = "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news";

// Broader football-related keywords
const KEYWORDS = [
  "Messi", "Ronaldo", "Barcelona", "Real Madrid", "Premier League", "Champions League",
  "Arsenal", "Manchester United", "Chelsea", "Liverpool", "Transfer", "Injury", "Goal",
  "Fixture", "Stats", "Debate", "Rumor", "La Liga", "Football", "Soccer"
];

async function fetchFootballNews() {
  try {
    const response = await axios.get(NEWS_API);
    const articles = response.data.articles || [];

    if (!articles.length) {
      throw new Error("No articles returned from ESPN API");
    }

    // Filter relevant football news
    let filtered = articles.filter(article =>
      KEYWORDS.some(kw =>
        article.headline?.toLowerCase().includes(kw.toLowerCase()) ||
        article.description?.toLowerCase().includes(kw.toLowerCase())
      )
    );

    // If no match, fallback to all articles
    if (!filtered.length) {
      console.warn("⚠️ No articles matched filters, using fallback");
      filtered = articles;
    }

    // Pick a random article
    const randomArticle = filtered[Math.floor(Math.random() * filtered.length)];

    return {
      title: randomArticle.headline || "Breaking Football News",
      description: randomArticle.description || "",
      link: randomArticle.links?.web?.href || "",
      image: randomArticle.images?.[0]?.url || null
    };
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    throw new Error("No targeted football news found.");
  }
}

module.exports = fetchFootballNews;
