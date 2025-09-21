// Development mode configuration for hackathon/demo purposes
export const isDevelopmentMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true';

export const useMockData = {
  // Check if we should use mock data for each platform
  twitter: isDevelopmentMode && (!process.env.TWITTER_API_KEY || process.env.USE_MOCK_TWITTER === 'true'),
  facebook: isDevelopmentMode && (!process.env.FACEBOOK_APP_ID || process.env.USE_MOCK_FACEBOOK === 'true'),
  youtube: isDevelopmentMode && (!process.env.YOUTUBE_API_KEY || process.env.USE_MOCK_YOUTUBE === 'true'),
  tiktok: isDevelopmentMode && (!process.env.TIKTOK_CLIENT_KEY || process.env.USE_MOCK_TIKTOK === 'true'),
};

export const mockConfig = {
  enabled: isDevelopmentMode,
  platforms: ['twitter', 'facebook', 'youtube', 'tiktok'] as const,
  defaultPostCount: 15,
  defaultAccountsPerUser: 4,
  
  // Demo user credentials for testing
  demoUsers: [
    {
      email: 'demo@cloudstro.ai',
      username: 'demo_user',
      fullName: 'Demo User',
      password: 'demo123'
    }
  ]
};