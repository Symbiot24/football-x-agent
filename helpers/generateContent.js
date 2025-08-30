function generateContent(title, source = "ESPN") {
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

  // Descriptive templates
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
