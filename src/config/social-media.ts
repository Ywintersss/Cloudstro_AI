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
  instagram: {
    accessToken: string;
    businessAccountId: string;
  };
  rednote: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
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
  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
  },
  rednote: {
    clientId: process.env.REDNOTE_CLIENT_ID || '',
    clientSecret: process.env.REDNOTE_CLIENT_SECRET || '',
    accessToken: process.env.REDNOTE_ACCESS_TOKEN || '',
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
  instagram: {
    baseUrl: 'https://graph.instagram.com',
    businessMedia: '/{user-id}/media',
    mediaInfo: '/{media-id}',
  },
  rednote: {
    baseUrl: 'https://api.xiaohongshu.com/ark/open_platform',
    posts: '/v1/note/list',
    profile: '/v1/user/info',
  },
  tiktok: {
    baseUrl: 'https://open-api.tiktok.com/platform/oauth/connect',
    posts: '/user/info',
    videos: '/video/list',
  },
};