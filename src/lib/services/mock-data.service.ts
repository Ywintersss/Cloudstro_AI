import { SocialMediaPost, SocialMediaAccount, PlatformMetrics } from '../../types/social-media';

// Mock data for hackathon demo
export class MockDataService {
  // Sample usernames and content for realistic looking data
  private static readonly SAMPLE_USERS = [
    { name: 'Sarah Johnson', handle: 'sarahj_marketing', platform: 'twitter' },
    { name: 'TechStartup Inc', handle: 'techstartup_inc', platform: 'facebook' },
    { name: 'Creative Agency', handle: 'creative_agency', platform: 'youtube' },
    { name: 'Fashion Blogger', handle: 'fashionista_daily', platform: 'tiktok' },
    { name: 'Digital Nomad', handle: 'nomad_life', platform: 'twitter' },
    { name: 'Food Enthusiast', handle: 'foodie_adventures', platform: 'facebook' },
  ];

  private static readonly SAMPLE_CONTENT = [
    'Just launched our new AI-powered social media tool! 🚀 #AI #SocialMedia #Innovation',
    'Amazing insights from today\'s conference on digital transformation 💡',
    'Working on some exciting new features. Can\'t wait to share them with you all! 🔥',
    'The future of AI in marketing is here. What are your thoughts? 🤖',
    'Behind the scenes of our latest project. So grateful for this amazing team! 👥',
    'Pro tip: Consistency is key in social media marketing 📈',
    'Just finished an incredible workshop on content creation ✨',
    'Coffee, code, and creativity - the perfect combination ☕💻',
    'Excited to announce our partnership with leading tech companies! 🤝',
    'What trends are you seeing in your industry? Let\'s discuss! 💬'
  ];

  private static readonly HASHTAGS = [
    ['AI', 'MachineLearning', 'Tech'],
    ['Marketing', 'DigitalMarketing', 'Growth'],
    ['Startup', 'Entrepreneur', 'Innovation'],
    ['ContentCreation', 'Branding', 'Design'],
    ['SocialMedia', 'Engagement', 'Community'],
    ['Leadership', 'Teamwork', 'Success'],
    ['TechTrends', 'FutureTech', 'Automation'],
    ['CreativeThinking', 'Inspiration', 'Motivation']
  ];

  static generateMockPosts(platform: string, count: number = 10): SocialMediaPost[] {
    const posts: SocialMediaPost[] = [];
    
    for (let i = 0; i < count; i++) {
      const user = this.SAMPLE_USERS[Math.floor(Math.random() * this.SAMPLE_USERS.length)];
      const content = this.SAMPLE_CONTENT[Math.floor(Math.random() * this.SAMPLE_CONTENT.length)];
      const hashtags = this.HASHTAGS[Math.floor(Math.random() * this.HASHTAGS.length)];
      
      posts.push({
        id: `mock_${platform}_${Date.now()}_${i}`,
        platform: platform as any,
        content,
        authorId: `user_${i + 1}`,
        authorName: user.name,
        authorHandle: user.handle,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        engagement: {
          likes: Math.floor(Math.random() * 1000) + 10,
          shares: Math.floor(Math.random() * 100) + 1,
          comments: Math.floor(Math.random() * 50) + 1,
          views: platform === 'youtube' || platform === 'tiktok' ? Math.floor(Math.random() * 10000) + 100 : undefined
        },
        media: Math.random() > 0.7 ? [{
          type: platform === 'youtube' || platform === 'tiktok' ? 'video' : 'image',
          url: `https://picsum.photos/800/600?random=${i}`,
          thumbnailUrl: `https://picsum.photos/400/300?random=${i}`
        }] : undefined,
        hashtags,
        mentions: [],
        url: `https://${platform}.com/post/${posts.length + i}`,
        isRepost: Math.random() > 0.8,
      });
    }
    
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static generateMockAccounts(userId: string): SocialMediaAccount[] {
    const platforms = ['twitter', 'facebook', 'youtube', 'tiktok'] as const;
    
    return platforms.map((platform, index) => ({
      id: `mock_account_${platform}_${userId}`,
      platform,
      accountId: `mock_${platform}_id_${Date.now()}`,
      accountName: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
      accountHandle: `demo_${platform}_handle`,
      accessToken: `mock_token_${platform}_${Date.now()}`,
      refreshToken: `mock_refresh_${platform}_${Date.now()}`,
      tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000), // Staggered creation dates
      updatedAt: new Date()
    }));
  }

  static generateMockMetrics(platform: string): PlatformMetrics {
    const totalPosts = Math.floor(Math.random() * 500) + 50;
    const totalEngagement = Math.floor(Math.random() * 50000) + 5000;
    const averageEngagementRate = Math.random() * 5 + 1; // 1-6%
    
    const postingTimes = ['09:00', '12:00', '15:00', '18:00', '21:00'];
    const bestPostingTime = postingTimes[Math.floor(Math.random() * postingTimes.length)];
    
    const allHashtags = this.HASHTAGS.flat();
    const topHashtags = allHashtags
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    const trends = ['increasing', 'decreasing', 'stable'] as const;
    const engagementTrend = trends[Math.floor(Math.random() * trends.length)];

    return {
      platform,
      totalPosts,
      totalEngagement,
      averageEngagementRate,
      bestPostingTime,
      topHashtags,
      engagementTrend
    };
  }

  static generateAnalyticsInsights(platform: string) {
    const insights = [
      {
        type: 'growth',
        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Growth Trending Up`,
        description: `Your ${platform} account has seen a ${Math.floor(Math.random() * 25) + 10}% increase in followers this month.`,
        impact: 'positive',
        actionable: true,
        suggestions: [
          'Continue posting at your current frequency',
          'Engage more with your audience in comments',
          'Try posting during peak hours (6-9 PM)'
        ]
      },
      {
        type: 'engagement',
        title: 'High Engagement Content Identified',
        description: `Posts with hashtags perform ${Math.floor(Math.random() * 40) + 20}% better than those without.`,
        impact: 'positive',
        actionable: true,
        suggestions: [
          'Use 3-5 relevant hashtags per post',
          'Research trending hashtags in your niche',
          'Create branded hashtags for campaigns'
        ]
      },
      {
        type: 'optimization',
        title: 'Best Posting Times',
        description: `Your audience is most active between ${Math.floor(Math.random() * 3) + 6}-${Math.floor(Math.random() * 3) + 9} PM.`,
        impact: 'neutral',
        actionable: true,
        suggestions: [
          'Schedule posts during peak hours',
          'Test different time slots',
          'Use analytics to refine timing'
        ]
      }
    ];

    return insights;
  }
}