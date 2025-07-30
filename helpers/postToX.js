const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET
});

async function downloadImage(imageUrl) {
  const filePath = path.join(__dirname, 'temp.jpg');
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer'
  });
  fs.writeFileSync(filePath, response.data);
  return filePath;
}

async function postToX(tweet, imageUrl) {
  if (!imageUrl) {
    await client.v2.tweet(tweet);
    console.log("✅ Tweet posted without image.");
    return;
  }

  try {
    const imagePath = await downloadImage(imageUrl);
    const mediaId = await client.v1.uploadMedia(imagePath);
    await client.v2.tweet({ text: tweet, media: { media_ids: [mediaId] } });
    console.log("✅ Tweet posted with image.");
    fs.unlinkSync(imagePath); // delete temp image
  } catch (err) {
    console.error("❌ Tweet failed:", err);
    throw err;
  }
}

module.exports = postToX;
