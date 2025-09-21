import { TwitterService } from './twitter.service';
import { FacebookService, InstagramService } from './facebook.service';
import { RedNoteService } from './rednote.service';
import { TikTokService } from './tiktok.service';
import { SocialMediaPost, SocialMediaAccount, PlatformMetrics } from '../../types/social-media';

export class SocialMediaManager {
  private twitterService: TwitterService;
  private facebookService: FacebookService;
  private instagramService: InstagramService;
  private rednoteService: RedNoteService;
  private tiktokService: TikTokService;

  constructor() {
    this.twitterService = new TwitterService();
    this.facebookService = new FacebookService();
    this.instagramService = new InstagramService();
    this.rednoteService = new RedNoteService();
    this.tiktokService = new TikTokService();
  }

  async getAllPosts(accounts: SocialMediaAccount[], count: number = 50): Promise<SocialMediaPost[]> {
    const allPosts: SocialMediaPost[] = [];
    const promises: Promise<SocialMediaPost[]>[] = [];

    for (const account of accounts) {
      if (!account.isActive) continue;

      try {
        switch (account.platform) {
          case 'twitter':
            promises.push(this.twitterService.getUserTweets(account.accountHandle || account.accountId, count));
            break;
          case 'facebook':
            promises.push(this.facebookService.getPagePosts(account.accountId, count));
            break;
          case 'instagram':
            promises.push(this.instagramService.getBusinessPosts(count));
            break;
          case 'rednote':
            promises.push(this.rednoteService.getUserNotes(account.accountId, count));
            break;
          case 'tiktok':
            promises.push(this.tiktokService.getUserVideos(account.accountId, count));
            break;
        }
      } catch (error) {
        console.error(`Error fetching posts for ${account.platform}:`, error);
      }
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value);
      }
    });

    // Sort posts by creation date (newest first)
    return allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostsByPlatform(platform: string, accountId: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      switch (platform) {
        case 'twitter':
          return await this.twitterService.getUserTweets(accountId, count);
        case 'facebook':
          return await this.facebookService.getPagePosts(accountId, count);
        case 'instagram':
          return await this.instagramService.getBusinessPosts(count);
        case 'rednote':
          return await this.rednoteService.getUserNotes(accountId, count);
        case 'tiktok':
          return await this.tiktokService.getUserVideos(accountId, count);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error fetching posts from ${platform}:`, error);
      throw error;
    }
  }

  async searchPosts(query: string, platforms: string[] = ['twitter'], count: number = 50): Promise<SocialMediaPost[]> {
    const allPosts: SocialMediaPost[] = [];
    const promises: Promise<SocialMediaPost[]>[] = [];

    for (const platform of platforms) {
      try {
        switch (platform) {
          case 'twitter':
            promises.push(this.twitterService.searchTweets(query, count));
            break;
          // Other platforms don't have public search APIs or require special permissions
          default:
            console.warn(`Search not supported for platform: ${platform}`);
        }
      } catch (error) {
        console.error(`Error searching posts on ${platform}:`, error);
      }
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value);
      }
    });

    return allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async postToMultiplePlatforms(
    content: string,
    platforms: string[],
    accounts: SocialMediaAccount[],
    mediaUrl?: string
  ): Promise<{ platform: string; postId?: string; error?: string }[]> {
    const results: { platform: string; postId?: string; error?: string }[] = [];

    for (const platform of platforms) {
      const account = accounts.find(acc => acc.platform === platform && acc.isActive);
      if (!account) {
        results.push({ platform, error: 'No active account found' });
        continue;
      }

      try {
        let postId: string;
        
        switch (platform) {
          case 'twitter':
            postId = await this.twitterService.postTweet(content, mediaUrl ? [mediaUrl] : undefined);
            break;
          case 'facebook':
            postId = await this.facebookService.postToFacebook(account.accountId, content, mediaUrl);
            break;
          case 'instagram':
            if (!mediaUrl) {
              throw new Error('Instagram requires media');
            }
            postId = await this.instagramService.postToInstagram(content, mediaUrl);
            break;
          case 'rednote':
            const images = mediaUrl ? [mediaUrl] : [];
            postId = await this.rednoteService.postToRedNote(content.substring(0, 50), content, images);
            break;
          case 'tiktok':
            throw new Error('TikTok posting requires special permissions');
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }

        results.push({ platform, postId });
      } catch (error) {
        results.push({ platform, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return results;
  }

  calculateEngagementMetrics(posts: SocialMediaPost[]): PlatformMetrics[] {
    const platformGroups = posts.reduce((groups, post) => {
      if (!groups[post.platform]) {
        groups[post.platform] = [];
      }
      groups[post.platform].push(post);
      return groups;
    }, {} as Record<string, SocialMediaPost[]>);

    const metrics: PlatformMetrics[] = [];

    for (const [platform, platformPosts] of Object.entries(platformGroups)) {
      const totalEngagement = platformPosts.reduce((sum, post) => {
        return sum + post.engagement.likes + post.engagement.shares + post.engagement.comments;
      }, 0);

      const totalFollowers = 1000; // This would come from account info
      const engagementRate = totalFollowers > 0 ? (totalEngagement / totalFollowers) * 100 : 0;

      // Calculate best posting time (simplified)
      const hourCounts = new Array(24).fill(0);
      platformPosts.forEach(post => {
        const hour = post.createdAt.getHours();
        hourCounts[hour] += post.engagement.likes + post.engagement.shares + post.engagement.comments;
      });
      const bestHour = hourCounts.indexOf(Math.max(...hourCounts));

      // Extract top hashtags
      const hashtagCounts: Record<string, number> = {};
      platformPosts.forEach(post => {
        post.hashtags.forEach(hashtag => {
          hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
        });
      });
      const topHashtags = Object.entries(hashtagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([hashtag]) => hashtag);

      metrics.push({
        platform,
        totalPosts: platformPosts.length,
        totalEngagement,
        averageEngagementRate: engagementRate,
        bestPostingTime: `${bestHour}:00`,
        topHashtags,
        engagementTrend: 'stable', // This would require historical data
      });
    }

    return metrics;
  }

  async analyzeOptimalTiming(posts: SocialMediaPost[]): Promise<{ [platform: string]: string[] }> {
    const platformTiming: { [platform: string]: string[] } = {};
    
    const platformGroups = posts.reduce((groups, post) => {
      if (!groups[post.platform]) {
        groups[post.platform] = [];
      }
      groups[post.platform].push(post);
      return groups;
    }, {} as Record<string, SocialMediaPost[]>);

    for (const [platform, platformPosts] of Object.entries(platformGroups)) {
      const hourlyEngagement = new Array(24).fill(0);
      
      platformPosts.forEach(post => {
        const hour = post.createdAt.getHours();
        const engagement = post.engagement.likes + post.engagement.shares + post.engagement.comments;
        hourlyEngagement[hour] += engagement;
      });

      // Find top 3 hours
      const topHours = hourlyEngagement
        .map((engagement, hour) => ({ hour, engagement }))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 3)
        .map(({ hour }) => `${hour}:00`);

      platformTiming[platform] = topHours;
    }

    return platformTiming;
  }
}