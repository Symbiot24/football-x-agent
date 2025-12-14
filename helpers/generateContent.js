const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateWithGroq(title, source) {
  try {
    const prompt = `
Create a highly engaging football tweet (under 500 characters) about this news headline: "${title}"

Guidelines:
- Make it punchy and scroll-stopping.
- Use fan-style language, not robotic or formal.
- Add 2–4 relevant football hashtags.
- No emojis unless they naturally fit.
- Keep it clear, hype-driven, and concise.
    `;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const text = response.choices[0].message.content;
    return text.trim();
  } catch (error) {
    console.error("Error generating content with Groq:", error);
    return null;
  }
}

async function generateContent(title, source = "ESPN") {
  const maxLength = 240;

  const groqContent = await generateWithGroq(title, source);

  if (groqContent) {
    let tweet = groqContent;

    // ensure max length
    if (tweet.length > maxLength) {
      tweet = tweet.slice(0, maxLength - 3) + "...";
    }

    return tweet;
  }

  return null; // return null if Groq fails
}

module.exports = generateContent;
