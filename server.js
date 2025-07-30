const express = require('express');
require('dotenv').config();
const fetchFootballNews = require('./helpers/fetchNews');
const generateContent = require('./helpers/generateContent');
const postToX = require('./helpers/postToX');
const scheduleDailyPosts = require('./scheduler/schedulePosts');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/generate', async (req, res) => {
  try {
    const news = await fetchFootballNews();
    const tweet = await generateContent(news.title);
    res.json({ tweet, source: news.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/post', async (req, res) => {
  try {
    const news = await fetchFootballNews();
    const tweet = await generateContent(news.title);
    await postToX(tweet, news.image);
    res.json({ tweet, source: news.url, status: "✅ Tweet posted" });
  } catch (err) {
    console.error('❌ Error during post:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  scheduleDailyPosts();
});
