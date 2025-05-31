import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '');

export async function POST(request: Request) {
  try {
    const { username, error } = await request.json();
    console.log('Error from request:', error);

    if (!process.env.TWITTER_BEARER_TOKEN) {
      return NextResponse.json({ error: 'Missing Twitter Bearer Token' }, { status: 500 });
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Remove @ if present
    const cleanUsername = username.replace('@', '');

    const user = await twitterClient.v2.userByUsername(cleanUsername, {
      'user.fields': ['public_metrics']
    });

    if (!user.data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tweets = await twitterClient.v2.userTimeline(user.data.id, {
      max_results: 3,
      'tweet.fields': ['public_metrics', 'created_at'],
      exclude: ['retweets', 'replies']
    });

    return NextResponse.json({
      user: user.data,
      tweets: tweets.data,
      metrics: {
        followers: user.data.public_metrics?.followers_count || 0,
        following: user.data.public_metrics?.following_count || 0,
        tweetsCount: user.data.public_metrics?.tweet_count || 0,
        likesCount: tweets.data.data.reduce((acc, tweet) => acc + (tweet.public_metrics?.like_count || 0), 0),
        retweetsCount: tweets.data.data.reduce((acc, tweet) => acc + (tweet.public_metrics?.retweet_count || 0), 0),
        repliesCount: tweets.data.data.reduce((acc, tweet) => acc + (tweet.public_metrics?.reply_count || 0), 0),
      }
    });
  } catch (error: any) {
    console.error('Twitter API Error:', error);

    // Try to extract Twitter API error details
    if (error?.data?.title && error?.data?.detail && error?.data?.status) {
      return NextResponse.json(
        { error: error.data.title, detail: error.data.detail },
        { status: error.data.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch Twitter data', detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}
