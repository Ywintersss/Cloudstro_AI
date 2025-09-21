// Types for standardized social media data across platforms
export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'youtube' | 'tiktok';
  content: string;
  authorId: string;
  authorName: string;
  authorHandle?: string;
  createdAt: Date;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  media?: {
    type: 'image' | 'video' | 'gif';
    url: string;
    thumbnailUrl?: string;
  }[];
  hashtags: string[];
  mentions: string[];
  url: string;
  isRepost?: boolean;
  originalPostId?: string;
}

export interface SocialMediaAccount {
  id: string;
  platform: 'twitter' | 'facebook' | 'youtube' | 'tiktok';
  accountId: string;
  accountName: string;
  accountHandle?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMediaEngagement {
  postId: string;
  platform: string;
  timestamp: Date;
  likes: number;
  shares: number;
  comments: number;
  views?: number;
  clickThroughRate?: number;
  engagementRate: number;
}

export interface PlatformMetrics {
  platform: string;
  totalPosts: number;
  totalEngagement: number;
  averageEngagementRate: number;
  bestPostingTime: string;
  topHashtags: string[];
  engagementTrend: 'increasing' | 'decreasing' | 'stable';
}