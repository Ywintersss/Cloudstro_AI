import { TwitterApi } from 'twitter-api-v2';
import { socialMediaConfig } from '../../config/social-media';
import { SocialMediaPost } from '../../types/social-media';

export class TwitterService {
  private client: TwitterApi;

  constructor() {
    this.client = new TwitterApi({
      appKey: socialMediaConfig.twitter.apiKey,
      appSecret: socialMediaConfig.twitter.apiSecret,
      accessToken: socialMediaConfig.twitter.accessToken,
      accessSecret: socialMediaConfig.twitter.accessTokenSecret,
    });
  }

  async getUserTweets(username: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      // Get user by username
      const user = await this.client.v2.userByUsername(username);
      if (!user.data) {
        throw new Error(`User ${username} not found`);
      }

      // Get user tweets
      const tweets = await this.client.v2.userTimeline(user.data?.id, {
        max_results: Math.min(count, 100),
        expansions: ['author_id', 'attachments.media_keys'],
        'tweet.fields': ['created_at', 'public_metrics', 'entities', 'attachments'],
        'user.fields': ['username', 'name'],
        'media.fields': ['type', 'url', 'preview_image_url'],
      });

      const posts: SocialMediaPost[] = [];
      
      for (const tweet of tweets.data.data || []) {
        const author = tweets.data.includes?.users?.find(u => u.id === tweet.author_id);
        const media = tweet.attachments?.media_keys?.map(key => {
          const mediaItem = tweets.data.includes?.media?.find(m => m.media_key === key);
          return mediaItem ? {
            type: mediaItem.type as 'image' | 'video' | 'gif',
            url: mediaItem.url || '',
            thumbnailUrl: mediaItem.preview_image_url,
          } : null;
        }).filter(Boolean) || [];

        const hashtags = tweet.entities?.hashtags?.map(h => h.tag) || [];
        const mentions = tweet.entities?.mentions?.map(m => m.username) || [];

        posts.push({
          id: tweet.id,
          platform: 'twitter',
          content: tweet.text,
          authorId: tweet.author_id || '',
          authorName: author?.name || '',
          authorHandle: author?.username || '',
          createdAt: new Date(tweet.created_at || ''),
          engagement: {
            likes: tweet.public_metrics?.like_count || 0,
            shares: tweet.public_metrics?.retweet_count || 0,
            comments: tweet.public_metrics?.reply_count || 0,
            views: tweet.public_metrics?.impression_count || 0,
          },
          media: media as any[],
          hashtags,
          mentions,
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error fetching Twitter posts:', error);
      throw error;
    }
  }

  async searchTweets(query: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      const tweets = await this.client.v2.search(query, {
        max_results: Math.min(count, 100),
        expansions: ['author_id', 'attachments.media_keys'],
        'tweet.fields': ['created_at', 'public_metrics', 'entities', 'attachments'],
        'user.fields': ['username', 'name'],
        'media.fields': ['type', 'url', 'preview_image_url'],
      });

      const posts: SocialMediaPost[] = [];
      
      for (const tweet of tweets.data.data || []) {
        const author = tweets.data.includes?.users?.find(u => u.id === tweet.author_id);
        const media = tweet.attachments?.media_keys?.map(key => {
          const mediaItem = tweets.data.includes?.media?.find(m => m.media_key === key);
          return mediaItem ? {
            type: mediaItem.type as 'image' | 'video' | 'gif',
            url: mediaItem.url || '',
            thumbnailUrl: mediaItem.preview_image_url,
          } : null;
        }).filter(Boolean) || [];

        const hashtags = tweet.entities?.hashtags?.map(h => h.tag) || [];
        const mentions = tweet.entities?.mentions?.map(m => m.username) || [];

        posts.push({
          id: tweet.id,
          platform: 'twitter',
          content: tweet.text,
          authorId: tweet.author_id || '',
          authorName: author?.name || '',
          authorHandle: author?.username || '',
          createdAt: new Date(tweet.created_at || ''),
          engagement: {
            likes: tweet.public_metrics?.like_count || 0,
            shares: tweet.public_metrics?.retweet_count || 0,
            comments: tweet.public_metrics?.reply_count || 0,
            views: tweet.public_metrics?.impression_count || 0,
          },
          media: media as any[],
          hashtags,
          mentions,
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error searching Twitter posts:', error);
      throw error;
    }
  }

  async postTweet(content: string, mediaUrls?: string[]): Promise<string> {
    try {
      let mediaIds: string[] = [];
      
      if (mediaUrls && mediaUrls.length > 0) {
        // Upload media first
        for (const url of mediaUrls) {
          const mediaId = await this.client.v1.uploadMedia(url);
          mediaIds.push(mediaId);
        }
      }

      const tweet = await this.client.v2.tweet({
        text: content,
        media: mediaIds.length > 0 ? { media_ids: mediaIds as any } : undefined,
      });

      return tweet.data?.id;
    } catch (error) {
      console.error('Error posting tweet:', error);
      throw error;
    }
  }
}