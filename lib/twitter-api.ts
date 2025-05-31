import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '');

export interface TwitterUserData {
  tweets: string[];
  metrics: {
    followers: number;
    following: number;
    tweetsCount: number;
    likesCount: number;
    retweetsCount: number;
    repliesCount: number;
  };
}

export async function fetchTwitterData(username: string): Promise<TwitterUserData> {
  try {
    // Remove @ if present
    const cleanUsername = username.replace('@', '');
    
    // Get user data
    const user = await twitterClient.v2.userByUsername(cleanUsername, {
      'user.fields': ['public_metrics']
    });

    if (!user.data) {
      throw new Error('User not found');
    }

    // Get only top 3 tweets
    const tweets = await twitterClient.v2.userTimeline(user.data.id, {
      max_results: 3,
      'tweet.fields': ['public_metrics', 'created_at'],
      exclude: ['retweets', 'replies']
    });

    const tweetTexts = tweets.data.data.map(tweet => tweet.text);
    
    // Calculate engagement metrics from the 3 tweets
    const metrics = {
      followers: user.data.public_metrics?.followers_count || 0,
      following: user.data.public_metrics?.following_count || 0,
      tweetsCount: user.data.public_metrics?.tweet_count || 0,
      likesCount: tweets.data.data.reduce((acc, tweet) => acc + (tweet.public_metrics?.like_count || 0), 0),
      retweetsCount: tweets.data.data.reduce((acc, tweet) => acc + (tweet.public_metrics?.retweet_count || 0), 0),
      repliesCount: tweets.data.data.reduce((acc, tweet) => acc + (tweet.public_metrics?.reply_count || 0), 0),
    };

    return {
      tweets: tweetTexts,
      metrics
    };
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    throw error;
  }
}