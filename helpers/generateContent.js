function generateContent(title) {

  const maxLength = 240;
  let tweet = title;

  if (tweet.length > maxLength) {
    tweet = tweet.slice(0, maxLength - 3) + '...';
  }

  return `${tweet} ⚽️🔥`;
}

module.exports = generateContent;
