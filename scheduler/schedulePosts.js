const postToX = require('../helpers/postToX');
const fetchFootballNews = require('../helpers/fetchNews');
const generateContent = require('../helpers/generateContent');

const POST_COUNT = 24;
const GAP_HOURS = 1; // Changed from 5 to 1
const GAP_MS = GAP_HOURS * 60 * 60 * 1000;

async function scheduleDailyPosts() {
  let postCount = 0;

  async function postTweet() {
    try {
      const news = await fetchFootballNews();
      const tweet = await generateContent(news.title);
      await postToX(tweet, news.image);
      postCount++;

      console.log(`✅ Tweet #${postCount} posted`);
    } catch (err) {
      console.error('❌ Error posting tweet:', err);
    }

    if (postCount < POST_COUNT) {
      console.log(`📅 Next tweet in ${GAP_HOURS} hours`);
      setTimeout(postTweet, GAP_MS);
    } else {
      console.log(`🔁 All ${POST_COUNT} tweets done. Waiting 24 hours for the next cycle.`);
      setTimeout(() => {
        postCount = 0;
        scheduleDailyPosts();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }
  }

  postTweet();
}

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

module.exports = scheduleDailyPosts;
