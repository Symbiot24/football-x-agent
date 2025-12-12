const axios = require("axios");

const NEWS_API = "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news";

// High-Engagement Keywords (Priority)
const HIGH_PRIORITY = ["Here we go", "Breaking", "Exclusive", "Official", "Done deal", "Agreement", "Medical"];

const KEYWORDS = {
  // THE TITANS (Highest Engagement)
  superstars: [
    "Mbappe", "Haaland", "Lamine Yamal", "Bellingham", "Vinicius", 
    "Salah", "Palmer", "Saka", "Musiala", "Wirtz", "Rodri", "Kevin De Bruyne", "Kane", "Lewandowski", "Rashford", 
    "Foden", "Pedri", "Gavi", "Lautaro Martinez", "Cubarsi", "Vitinha", "Nuno Mendes",
    "Dembele", "Rice", "Van dijk", "Alisson", "Ederson", "Son Heung-min",
  ],
  
  // THE LEGENDS (Never-ending GOAT debate/Nostalgia)
  legends: ["Messi", "Ronaldo", "Neymar", "Zidane", "Ronaldinho", "Pirlo", "Totti", "Buffon", "Xavi", "Iniesta", "Shevchenko", "Henry", "Giggs", "Scholes", "Pele", "Maradona"],
  
  // TOP CLUBS (Global Fanbases)
  clubs: [
    "Real Madrid", "Man City", "Arsenal", "Liverpool", "Barcelona", 
    "Man Utd", "Bayern Munich", "PSG", "Chelsea", "Inter Milan", "Juventus", "Bayer Leverkusen", "AC Milan", "Tottenham", "Atletico Madrid"
  ],
  
  // TOP MANAGERS (Tactics & Drama)
  managers: [
    "Guardiola", "Arne Slot", "Xabi Alonso", "Hansi Flick", "Mikel Arteta", 
    "Carlo Ancelotti", "Mourinho", "Luis Enrique", "Thomas Tuchel", "Unai Emery",
    "Jurgen Klopp", "Ten Hag", "Zidane", "Pochettino",
    "Diego Simeone", "Antonio Conte", "Gatuso"
  ],
  
  // COMPETITIONS (Urgency)
  tournaments: [
    "Champions League", "Premier League", "La Liga", "Serie A", 
    "Bundesliga", "Club World Cup", "World Cup Qualifiers", "Ballon d'Or", "Golden Boot", "Europa League", "Conference League", "FA Cup", "Copa America", "Africa Cup of Nations",
    "Copa Libertadores", "UEFA Super Cup", "FIFA World Cup", "UEFA Euro", "Ligue 1"
  ]
};

// Flatten for your filter logic
const STANDARD_KEYWORDS = [].concat(...Object.values(KEYWORDS));

async function fetchFootballNews() {
  try {
    const response = await axios.get(NEWS_API);
    const articles = response.data.articles || [];

    if (!articles.length) throw new Error("No articles found");

    // 1. Map articles with a "Priority Score"
    const scoredArticles = articles.map(article => {
      let score = 0;
      const text = `${article.headline} ${article.description}`.toLowerCase();
      
      HIGH_PRIORITY.forEach(kw => { if (text.includes(kw.toLowerCase())) score += 10; });
      STANDARD_KEYWORDS.forEach(kw => { if (text.includes(kw.toLowerCase())) score += 2; });
      
      return { ...article, score };
    });

    // 2. Sort by score (descending) and take top 5 to pick one
    const topArticles = scoredArticles
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const selection = topArticles.length > 0 
      ? topArticles[Math.floor(Math.random() * topArticles.length)] 
      : articles[0]; // Fallback to latest

    return {
      title: selection.headline,
      description: selection.description,
      link: selection.links?.web?.href,
      image: selection.images?.[0]?.url,
      isBreaking: selection.score >= 10
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return null;
  }
}

module.exports = fetchFootballNews;