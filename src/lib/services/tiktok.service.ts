import axios from 'axios';
import { socialMediaConfig, API_ENDPOINTS } from '../../config/social-media';
import { SocialMediaPost } from '../../types/social-media';

export class TikTokService {
  private accessToken: string;
  private baseUrl: string;
  private clientKey: string;

  constructor() {
    this.accessToken = socialMediaConfig.tiktok.accessToken;
    this.clientKey = socialMediaConfig.tiktok.clientKey;
    this.baseUrl = API_ENDPOINTS.tiktok.baseUrl;
  }

  async getUserVideos(userId: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      // Note: TikTok API has strict requirements and this is a simplified implementation
      const response = await axios.post('https://open-api.tiktok.com/platform/oauth/connect/', {
        client_key: this.clientKey,
        access_token: this.accessToken,
        fields: 'open_id,union_id,avatar_url,display_name,video.list',
        count: Math.min(count, 50), // TikTok has stricter limits
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const posts: SocialMediaPost[] = [];
      const videos = response.data?.data?.videos || [];
      
      for (const video of videos) {
        posts.push({
          id: video.video_id || '',
          platform: 'tiktok',
          content: video.video_description || '',
          authorId: userId,
          authorName: video.display_name || '',
          authorHandle: video.username || '',
          createdAt: new Date(video.create_time * 1000 || Date.now()),
          engagement: {
            likes: video.like_count || 0,
            shares: video.share_count || 0,
            comments: video.comment_count || 0,
            views: video.view_count || 0,
          },
          media: [{
            type: 'video',
            url: video.video_url || '',
            thumbnailUrl: video.cover_image_url || '',
          }],
          hashtags: this.extractHashtags(video.video_description || ''),
          mentions: this.extractMentions(video.video_description || ''),
          url: `https://tiktok.com/@${video.username}/video/${video.video_id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error fetching TikTok videos:', error);
      throw error;
    }
  }

  async getUserInfo(userId: string): Promise<any> {
    try {
      const response = await axios.post('https://open-api.tiktok.com/platform/oauth/connect/', {
        client_key: this.clientKey,
        access_token: this.accessToken,
        fields: 'open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data?.data || {};
    } catch (error) {
      console.error('Error fetching TikTok user info:', error);
      throw error;
    }
  }

  // Note: TikTok posting requires special permissions and is not available in basic API
  async postToTikTok(content: string, videoUrl: string): Promise<string> {
    try {
      // This would require TikTok's content publishing API which has strict approval requirements
      throw new Error('TikTok posting requires special API permissions and approval from TikTok');
    } catch (error) {
      console.error('Error posting to TikTok:', error);
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