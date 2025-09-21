import { PostRepository } from '../repositories/post.repository';
import { SocialMediaRepository } from '../repositories/social-media.repository';
import { SocialMediaManager } from './social-media-manager';
import { SocialMediaPost } from '../../types/social-media';

export interface DashboardAnalytics {
  totalPosts: number;
  engagementRate: number;
  topHashtags: string[];
  bestPostingTime: string;
  bestPostingDay: string;
  averageEngagement: number;
  totalReach: number;
  regionStats: Array<{ region: string; percentage: number }>;
  platformStats: Array<{ platform: string; posts: number; engagement: number }>;
  recentActivity: Array<{ date: string; posts: number; engagement: number }>;
}

export class DashboardAnalyticsService {
  private postRepository: PostRepository;
  private socialMediaRepository: SocialMediaRepository;
  private socialMediaManager: SocialMediaManager;

  constructor() {
    this.postRepository = new PostRepository();
    this.socialMediaRepository = new SocialMediaRepository();
    this.socialMediaManager = new SocialMediaManager();
  }

  async getDashboardAnalytics(userId: string, timeRange: number = 30): Promise<DashboardAnalytics> {
    try {
      // Get all posts for the user
      const allPosts = await this.postRepository.getPostsByUser(userId, 1000);
      
      // Filter posts by time range
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - timeRange);
      const recentPosts = allPosts.filter(post => new Date(post.createdAt) >= cutoffDate);

      // If no posts exist, return default analytics
      if (recentPosts.length === 0) {
        return this.getDefaultAnalytics();
      }

      // Calculate total engagement metrics
      const totalPosts = recentPosts.length;
      const totalEngagement = recentPosts.reduce((sum, post) => 
        sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
      );

      // Calculate engagement rate (simplified - would need follower data in real implementation)
      const averageEngagement = totalEngagement / totalPosts;
      const engagementRate = averageEngagement / 100; // Simplified calculation

      // Extract and count hashtags
      const hashtagCounts: Record<string, number> = {};
      recentPosts.forEach(post => {
        post.hashtags.forEach(hashtag => {
          hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
        });
      });
      const topHashtags = Object.entries(hashtagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([hashtag]) => hashtag.startsWith('#') ? hashtag : `#${hashtag}`);

      // Calculate best posting time
      const hourEngagement = new Array(24).fill(0);
      const hourCounts = new Array(24).fill(0);
      recentPosts.forEach(post => {
        const hour = new Date(post.createdAt).getHours();
        const engagement = post.engagement.likes + post.engagement.shares + post.engagement.comments;
        hourEngagement[hour] += engagement;
        hourCounts[hour] += 1;
      });
      
      const bestHour = hourEngagement.indexOf(Math.max(...hourEngagement));
      const bestPostingTime = `${bestHour.toString().padStart(2, '0')}:00`;

      // Calculate best posting day
      const dayEngagement = new Array(7).fill(0);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      recentPosts.forEach(post => {
        const day = new Date(post.createdAt).getDay();
        const engagement = post.engagement.likes + post.engagement.shares + post.engagement.comments;
        dayEngagement[day] += engagement;
      });
      const bestDay = dayEngagement.indexOf(Math.max(...dayEngagement));
      const bestPostingDay = dayNames[bestDay];

      // Calculate platform statistics
      const platformStats = this.calculatePlatformStats(recentPosts);

      // Calculate recent activity (last 7 days)
      const recentActivity = this.calculateRecentActivity(recentPosts, 7);

      // Mock region stats (would need geo data in real implementation)
      const regionStats = [
        { region: 'United States', percentage: 45 },
        { region: 'Canada', percentage: 23 },
        { region: 'United Kingdom', percentage: 18 },
        { region: 'Australia', percentage: 14 }
      ];

      // Estimate total reach (simplified calculation)
      const totalReach = Math.round(totalEngagement * 2.5); // Rough estimate

      return {
        totalPosts,
        engagementRate: Math.round(engagementRate * 100) / 100,
        topHashtags,
        bestPostingTime,
        bestPostingDay,
        averageEngagement: Math.round(averageEngagement),
        totalReach,
        regionStats,
        platformStats,
        recentActivity
      };

    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      return this.getDefaultAnalytics();
    }
  }

  private calculatePlatformStats(posts: SocialMediaPost[]) {
    const platformGroups = posts.reduce((groups, post) => {
      if (!groups[post.platform]) {
        groups[post.platform] = [];
      }
      groups[post.platform].push(post);
      return groups;
    }, {} as Record<string, SocialMediaPost[]>);

    return Object.entries(platformGroups).map(([platform, platformPosts]) => ({
      platform,
      posts: platformPosts.length,
      engagement: platformPosts.reduce((sum, post) => 
        sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
      )
    }));
  }

  private calculateRecentActivity(posts: SocialMediaPost[], days: number) {
    const activity: Array<{ date: string; posts: number; engagement: number }> = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.createdAt).toISOString().split('T')[0];
        return postDate === dateStr;
      });
      
      const dayEngagement = dayPosts.reduce((sum, post) => 
        sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
      );
      
      activity.unshift({
        date: dateStr,
        posts: dayPosts.length,
        engagement: dayEngagement
      });
    }
    
    return activity;
  }

  private getDefaultAnalytics(): DashboardAnalytics {
    return {
      totalPosts: 0,
      engagementRate: 0,
      topHashtags: ['#marketing', '#growth', '#engagement'],
      bestPostingTime: '14:00',
      bestPostingDay: 'Tuesday',
      averageEngagement: 0,
      totalReach: 0,
      regionStats: [
        { region: 'United States', percentage: 45 },
        { region: 'Canada', percentage: 23 },
        { region: 'United Kingdom', percentage: 18 },
        { region: 'Australia', percentage: 14 }
      ],
      platformStats: [],
      recentActivity: []
    };
  }

  async getPostsCount(userId: string): Promise<number> {
    try {
      const posts = await this.postRepository.getPostsByUser(userId, 1000);
      return posts.length;
    } catch (error) {
      console.error('Error getting posts count:', error);
      return 0;
    }
  }

  async getEngagementTrend(userId: string, days: number = 7): Promise<{ trend: 'up' | 'down' | 'stable'; percentage: number }> {
    try {
      const posts = await this.postRepository.getPostsByUser(userId, 1000);
      
      const now = new Date();
      const midPoint = new Date(now.getTime() - (days / 2) * 24 * 60 * 60 * 1000);
      const startPoint = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      const recentPosts = posts.filter(post => new Date(post.createdAt) >= midPoint);
      const olderPosts = posts.filter(post => 
        new Date(post.createdAt) >= startPoint && new Date(post.createdAt) < midPoint
      );
      
      const recentEngagement = recentPosts.reduce((sum, post) => 
        sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
      );
      const olderEngagement = olderPosts.reduce((sum, post) => 
        sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
      );
      
      if (olderEngagement === 0) {
        return { trend: 'stable', percentage: 0 };
      }
      
      const percentageChange = ((recentEngagement - olderEngagement) / olderEngagement) * 100;
      
      return {
        trend: percentageChange > 5 ? 'up' : percentageChange < -5 ? 'down' : 'stable',
        percentage: Math.abs(Math.round(percentageChange * 100) / 100)
      };
      
    } catch (error) {
      console.error('Error calculating engagement trend:', error);
      return { trend: 'stable', percentage: 0 };
    }
  }
}