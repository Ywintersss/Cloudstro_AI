import { TwitterService } from './twitter.service';
import { FacebookService } from './facebook.service';
import { YouTubeService } from './youtube.service';
import { TikTokService } from './tiktok.service';
import { MockDataService } from './mock-data.service';
import { SocialMediaPost, SocialMediaAccount, PlatformMetrics } from '../../types/social-media';
import { useMockData } from '../../config/development';

export class SocialMediaManager {
  private twitterService: TwitterService;
  private facebookService: FacebookService;
  private youtubeService: YouTubeService;
  private tiktokService: TikTokService;

  constructor() {
    this.twitterService = new TwitterService();
    this.facebookService = new FacebookService();
    this.youtubeService = new YouTubeService();
    this.tiktokService = new TikTokService();
  }

  async getAllPosts(accounts: SocialMediaAccount[], count: number = 50): Promise<SocialMediaPost[]> {
    const allPosts: SocialMediaPost[] = [];
    const promises: Promise<SocialMediaPost[]>[] = [];

    for (const account of accounts) {
      if (!account.isActive) continue;

      try {
        // Check if we should use mock data for this platform
        const shouldUseMock = useMockData[account.platform as keyof typeof useMockData];
        
        if (shouldUseMock) {
          // Use mock data for demo purposes
          console.log(`Using mock data for ${account.platform} (demo mode)`);
          promises.push(Promise.resolve(MockDataService.generateMockPosts(account.platform, count)));
        } else {
          // Use real API services
          switch (account.platform) {
            case 'twitter':
              promises.push(this.twitterService.getUserTweets(account.accountHandle || account.accountId, count));
              break;
            case 'facebook':
              promises.push(this.facebookService.getPagePosts(account.accountId, count));
              break;
            case 'youtube':
              promises.push(this.youtubeService.getChannelVideos(account.accountId, count));
              break;
            case 'tiktok':
              promises.push(this.tiktokService.getUserVideos(account.accountId, count));
              break;
          }
        }
      } catch (error) {
        console.error(`Error fetching posts for ${account.platform}:`, error);
        // Fallback to mock data if real API fails
        promises.push(Promise.resolve(MockDataService.generateMockPosts(account.platform, count)));
      }
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value);
      }
    });

    // Sort posts by creation date (newest first)
    return allPosts.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime());
  }

  async getPostsByPlatform(platform: string, accountId: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      // Check if we should use mock data for this platform
      const shouldUseMock = useMockData[platform as keyof typeof useMockData];
      
      if (shouldUseMock) {
        console.log(`Using mock data for ${platform} (demo mode)`);
        return MockDataService.generateMockPosts(platform, count);
      }

      switch (platform) {
        case 'twitter':
          return await this.twitterService.getUserTweets(accountId, count);
        case 'facebook':
          return await this.facebookService.getPagePosts(accountId, count);
        case 'youtube':
          return await this.youtubeService.getChannelVideos(accountId, count);
        case 'tiktok':
          return await this.tiktokService.getUserVideos(accountId, count);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error fetching posts from ${platform}:`, error);
      // Fallback to mock data if real API fails
      console.log(`Falling back to mock data for ${platform}`);
      return MockDataService.generateMockPosts(platform, count);
    }
  }

  async searchPosts(query: string, platforms: string[] = ['twitter'], count: number = 50): Promise<SocialMediaPost[]> {
    const allPosts: SocialMediaPost[] = [];
    const promises: Promise<SocialMediaPost[]>[] = [];

    for (const platform of platforms) {
      try {
        // Check if we should use mock data for this platform
        const shouldUseMock = useMockData[platform as keyof typeof useMockData];
        
        if (shouldUseMock) {
          console.log(`Using mock search data for ${platform} (demo mode)`);
          const mockPosts = MockDataService.generateMockPosts(platform, count);
          // Filter mock posts to somewhat match the query (for demo purposes)
          const filteredPosts = mockPosts.filter(post => 
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          );
          promises.push(Promise.resolve(filteredPosts.length > 0 ? filteredPosts : mockPosts.slice(0, Math.min(5, count))));
        } else {
          switch (platform) {
            case 'twitter':
              promises.push(this.twitterService.searchTweets(query, count));
              break;
            // Other platforms don't have public search APIs or require special permissions
            default:
              console.warn(`Search not supported for platform: ${platform}`);
          }
        }
      } catch (error) {
        console.error(`Error searching posts on ${platform}:`, error);
        // Fallback to mock data
        promises.push(Promise.resolve(MockDataService.generateMockPosts(platform, 5)));
      }
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value);
      }
    });

    return allPosts.sort((a, b) => b.createdAt?.getTime() - a.createdAt?.getTime());
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
          case 'youtube':
            throw new Error('YouTube posting requires video upload and special permissions');
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
        return sum + post.engagement?.likes + post.engagement?.shares + post.engagement?.comments;
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

  async getPlatformMetrics(platform: string): Promise<PlatformMetrics> {
    try {
      // Check if we should use mock data for this platform
      const shouldUseMock = useMockData[platform as keyof typeof useMockData];
      
      if (shouldUseMock) {
        console.log(`Using mock metrics for ${platform} (demo mode)`);
        return MockDataService.generateMockMetrics(platform);
      }

      // For real implementations, you would call platform-specific analytics APIs here
      // For now, return mock data as fallback
      console.log(`Real analytics not implemented for ${platform}, using mock data`);
      return MockDataService.generateMockMetrics(platform);
    } catch (error) {
      console.error(`Error fetching metrics for ${platform}:`, error);
      return MockDataService.generateMockMetrics(platform);
    }
  }

  async getAnalyticsInsights(platform: string) {
    try {
      // Check if we should use mock data for this platform
      const shouldUseMock = useMockData[platform as keyof typeof useMockData];
      
      if (shouldUseMock) {
        console.log(`Using mock insights for ${platform} (demo mode)`);
        return MockDataService.generateAnalyticsInsights(platform);
      }

      // For real implementations, you would call AI analysis services here
      console.log(`Real insights not implemented for ${platform}, using mock data`);
      return MockDataService.generateAnalyticsInsights(platform);
    } catch (error) {
      console.error(`Error generating insights for ${platform}:`, error);
      return MockDataService.generateAnalyticsInsights(platform);
    }
  }
}