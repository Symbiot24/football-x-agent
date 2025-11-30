const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function generateWithGemini(title, source) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Create an engaging tweet (under 240 characters) about this football news headline: "${title}". 
    Mention that it's from ${source}. Make it catchy, social media friendly, and include relevant hashtags.`;
    
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

  // Generate content with Gemini
  const geminiContent = await generateWithGemini(title, source);
  
  if (geminiContent) {
    // Ensure the content is within the max length
    let tweet = geminiContent;
    if (tweet.length > maxLength) {
      tweet = tweet.slice(0, maxLength - 3) + "...";
    }
    return tweet;
  }

  // Return null if Gemini fails
  return null;
}

module.exports = generateContent;
