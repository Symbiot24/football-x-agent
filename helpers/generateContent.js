const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function generateWithGemini(title, source) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Create an engaging tweet (under 200 characters) about this football news headline: "${title}". 
    Mention that it's from ${source}. Make it catchy and social media friendly. 
    Don't include hashtags as I'll add them separately.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return null;
  }
}

async function generateContent(title, source = "ESPN") {
  const maxLength = 240;

  const hashtags = [
    "#Messi", "#Ronaldo", "#Barcelona", "#RealMadrid", "#PremierLeague", "#UCL",
    "#ChampionsLeague", "#Arsenal", "#ManUnited", "#Chelsea", "#Liverpool",
    "#Transfers", "#InjuryUpdate", "#Goal", "#LaLiga", "#EPL", "#Soccer", "#Football"
  ];

  // Pick 2–3 random hashtags
  const getHashtags = () => {
    const shuffled = [...hashtags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).join(" ");
  };

  // Try to generate content with Gemini first
  const geminiContent = await generateWithGemini(title, source);
  
  if (geminiContent) {
    // Ensure the content is within the max length
    let tweet = geminiContent;
    if (tweet.length > maxLength - getHashtags().length - 2) {
      tweet = tweet.slice(0, maxLength - getHashtags().length - 5) + "...";
    }
    return `${tweet}\n\n${getHashtags()}`;
  }
  
  // Fall back to templates if Gemini fails
  const templates = [
    `🚨 ${title}\n\n${source} reports: ${title.toLowerCase()}. Thoughts?`,
    `🔥 ${title}! This could be huge for the season. Agree or not?`,
    `👀 ${title}. Experts believe this changes everything. Do you agree?`,
    `${title}\n\n⚽ Full story via ${source}. What’s your prediction?`
  ];

  // Pick one randomly
  let tweet = templates[Math.floor(Math.random() * templates.length)];

  // Trim if too long
  if (tweet.length > maxLength) {
    tweet = tweet.slice(0, maxLength - 3) + "...";
  }

  return `${tweet}\n\n${getHashtags()}`;
}

module.exports = generateContent;
