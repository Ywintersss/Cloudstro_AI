import axios from 'axios';
import { socialMediaConfig, API_ENDPOINTS } from '../../config/social-media';
import { SocialMediaPost } from '../../types/social-media';

export class FacebookService {
  private accessToken: string;
  private baseUrl: string;

  constructor() {
    this.accessToken = socialMediaConfig.facebook.accessToken;
    this.baseUrl = API_ENDPOINTS.facebook.baseUrl;
  }

  async getPagePosts(pageId: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${pageId}/posts`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,message,created_time,likes.summary(true),shares,comments.summary(true),attachments,permalink_url',
          limit: Math.min(count, 100),
        },
      });

      const posts: SocialMediaPost[] = [];
      
      for (const post of response.data.data || []) {
        const media = post.attachments?.data?.[0]?.media || post.attachments?.data?.[0]?.subattachments?.data || [];
        
        posts.push({
          id: post.id,
          platform: 'facebook',
          content: post.message || '',
          authorId: pageId,
          authorName: '', // Will be filled by page info
          createdAt: new Date(post.created_time),
          engagement: {
            likes: post.likes?.summary?.total_count || 0,
            shares: post.shares?.count || 0,
            comments: post.comments?.summary?.total_count || 0,
          },
          media: media.map((m: any) => ({
            type: m.media?.image ? 'image' : 'video',
            url: m.media?.image?.src || m.media?.source || '',
            thumbnailUrl: m.media?.image?.src,
          })),
          hashtags: this.extractHashtags(post.message || ''),
          mentions: this.extractMentions(post.message || ''),
          url: post.permalink_url || `https://facebook.com/${post.id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      throw error;
    }
  }

  async postToFacebook(pageId: string, content: string, imageUrl?: string): Promise<string> {
    try {
      let postData: any = {
        message: content,
        access_token: this.accessToken,
      };

      if (imageUrl) {
        postData.url = imageUrl;
      }

      const response = await axios.post(`${this.baseUrl}/${pageId}/posts`, postData);
      return response.data.id;
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      throw error;
    }
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@([a-zA-Z0-9_.]+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
  }
}

export class InstagramService {
  private accessToken: string;
  private baseUrl: string;
  private businessAccountId: string;

  constructor() {
    this.accessToken = socialMediaConfig.instagram.accessToken;
    this.businessAccountId = socialMediaConfig.instagram.businessAccountId;
    this.baseUrl = API_ENDPOINTS.instagram.baseUrl;
  }

  async getBusinessPosts(count: number = 50): Promise<SocialMediaPost[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.businessAccountId}/media`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
          limit: Math.min(count, 100),
        },
      });

      const posts: SocialMediaPost[] = [];
      
      for (const post of response.data.data || []) {
        posts.push({
          id: post.id,
          platform: 'instagram',
          content: post.caption || '',
          authorId: this.businessAccountId,
          authorName: '', // Will be filled by business account info
          createdAt: new Date(post.timestamp),
          engagement: {
            likes: post.like_count || 0,
            shares: 0, // Instagram doesn't provide share count
            comments: post.comments_count || 0,
          },
          media: [{
            type: post.media_type?.toLowerCase() === 'video' ? 'video' : 'image',
            url: post.media_url || '',
            thumbnailUrl: post.thumbnail_url || post.media_url,
          }],
          hashtags: this.extractHashtags(post.caption || ''),
          mentions: this.extractMentions(post.caption || ''),
          url: post.permalink || `https://instagram.com/p/${post.id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  async postToInstagram(caption: string, imageUrl: string): Promise<string> {
    try {
      // First, create media object
      const mediaResponse = await axios.post(`${this.baseUrl}/${this.businessAccountId}/media`, {
        image_url: imageUrl,
        caption: caption,
        access_token: this.accessToken,
      });

      const mediaId = mediaResponse.data.id;

      // Then publish the media
      const publishResponse = await axios.post(`${this.baseUrl}/${this.businessAccountId}/media_publish`, {
        creation_id: mediaId,
        access_token: this.accessToken,
      });

      return publishResponse.data.id;
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      throw error;
    }
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@([a-zA-Z0-9_.]+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
  }
}