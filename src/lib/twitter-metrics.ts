export async function getTwitterMetrics(tweetId: string) {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) throw new Error("Missing TWITTER_BEARER_TOKEN env var");

  const res = await fetch(`https://api.twitter.com/2/tweets?ids=${tweetId}&tweet.fields=public_metrics`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(`Failed to fetch Twitter metrics: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const tweet = data.data?.[0];

  if (!tweet || !tweet.public_metrics) {
    return { likes: 0, retweets: 0, replies: 0, impressions: 0, bookmarks: 0 };
  }

  const m = tweet.public_metrics;
  return {
    likes: m.like_count || 0,
    retweets: m.retweet_count || 0,
    replies: m.reply_count || 0,
    impressions: m.impression_count || 0,
    bookmarks: m.bookmark_count || 0
  };
}
