const axios = require('axios');

function generateHashtags(text) {
  const keywords = [
    'Messi', 'Ronaldo', 'Barcelona', 'Real Madrid', 'Premier League', 'Champions League',
    'Arsenal', 'Manchester United', 'Chelsea', 'Liverpool', 'Transfer', 'Injury', 'Goal',
    'Fixture', 'Stats', 'Debate', 'Rumor', 'News', 'La Liga'
  ];

  const tags = new Set();

  for (const keyword of keywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      tags.add(`#${keyword.replace(/\s+/g, '')}`);
    }
  }

  return [...tags].slice(0, 4).join(' ');
}

function detectSourceType(article) {
  const isRumor = /rumor|transfer/i.test(article.headline);
  return isRumor ? '🗞️ via ESPN Rumors' : '📰 via ESPN';
}

// 🎯 FILTERS to apply
const filters = ['Messi', 'Neymar', 'ISL', 'Ronaldo', 'La Liga', 'Barcelona', 'Premier League', 'Real Madrid'];

async function fetchFootballNews() {
  const url = 'http://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news';

  const response = await axios.get(url);
  const articles = response.data?.articles;

  if (!articles || articles.length === 0) {
    console.error("❌ ESPN articles missing or empty");
    throw new Error('No football news found from ESPN.');
  }

  const validArticles = articles.filter(
    (a) => a.headline && a.links?.web?.href
  );

  // 🧠 Apply filters: only allow articles that include one of the filter keywords
  const filteredArticles = validArticles.filter((article) => {
    const text = `${article.headline} ${article.description || ''}`;
    return filters.some(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  if (filteredArticles.length === 0) {
    console.error("❌ No articles matched filters");
    throw new Error('No targeted football news found.');
  }

  const article = filteredArticles[Math.floor(Math.random() * filteredArticles.length)];

  const hashtags = generateHashtags(article.headline);
  const sourceTag = detectSourceType(article);

  return {
    title: `${article.headline} ${hashtags} ${sourceTag}`,
    image: article.images?.[0]?.url || null,
    url: article.links.web.href,
  };
}

module.exports = fetchFootballNews;
