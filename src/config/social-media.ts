export interface SocialMediaConfig {
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
    bearerToken: string;
  };
  facebook: {
    appId: string;
    appSecret: string;
    accessToken: string;
  };
  youtube: {
    apiKey: string;
    clientId: string;
    clientSecret: string;
  };
  tiktok: {
    clientKey: string;
    clientSecret: string;
    accessToken: string;
  };
}

export const socialMediaConfig: SocialMediaConfig = {
  twitter: {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
    bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
    clientId: process.env.YOUTUBE_CLIENT_ID || '',
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
  },
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || '',
  },
};

export const API_ENDPOINTS = {
  twitter: {
    baseUrl: 'https://api.twitter.com/2',
    userTweets: '/users/{id}/tweets',
    userInfo: '/users/by/username/{username}',
  },
  facebook: {
    baseUrl: 'https://graph.facebook.com/v18.0',
    pagePosts: '/{page-id}/posts',
    pageInfo: '/{page-id}',
  },
  youtube: {
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    videos: '/videos',
    channels: '/channels',
    search: '/search',
    playlistItems: '/playlistItems',
  },
  tiktok: {
    baseUrl: 'https://open-api.tiktok.com/platform/oauth/connect',
    posts: '/user/info',
    videos: '/video/list',
  },
};