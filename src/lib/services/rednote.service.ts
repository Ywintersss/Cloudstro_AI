import axios from 'axios';
import { socialMediaConfig, API_ENDPOINTS } from '../../config/social-media';
import { SocialMediaPost } from '../../types/social-media';

export class RedNoteService {
  private accessToken: string;
  private baseUrl: string;
  private clientId: string;

  constructor() {
    this.accessToken = socialMediaConfig.rednote.accessToken;
    this.clientId = socialMediaConfig.rednote.clientId;
    this.baseUrl = API_ENDPOINTS.rednote.baseUrl;
  }

  async getUserNotes(userId: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      // RedNote (小红书) API structure - this is a simplified implementation
      // Actual API may require different authentication and parameters
      const response = await axios.get(`${this.baseUrl}/v1/note/list`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Client-ID': this.clientId,
          'Content-Type': 'application/json',
        },
        params: {
          user_id: userId,
          count: Math.min(count, 50), // RedNote has strict limits
          sort: 'time',
        },
      });

      const posts: SocialMediaPost[] = [];
      const notes = response.data?.data?.notes || [];
      
      for (const note of notes) {
        posts.push({
          id: note.note_id || '',
          platform: 'rednote',
          content: note.title + '\n' + (note.desc || ''),
          authorId: userId,
          authorName: note.user?.nickname || '',
          authorHandle: note.user?.red_id || '',
          createdAt: new Date(note.time * 1000 || Date.now()),
          engagement: {
            likes: note.interact_info?.liked_count || 0,
            shares: note.interact_info?.shared_count || 0,
            comments: note.interact_info?.comment_count || 0,
            views: note.interact_info?.view_count || 0,
          },
          media: this.extractMedia(note.image_list || []),
          hashtags: this.extractHashtags(note.desc || ''),
          mentions: this.extractMentions(note.desc || ''),
          url: `https://www.xiaohongshu.com/explore/${note.note_id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error fetching RedNote posts:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/user/info`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Client-ID': this.clientId,
          'Content-Type': 'application/json',
        },
        params: {
          user_id: userId,
        },
      });

      return response.data?.data || {};
    } catch (error) {
      console.error('Error fetching RedNote user profile:', error);
      throw error;
    }
  }

  async searchNotes(keyword: string, count: number = 20): Promise<SocialMediaPost[]> {
    try {
      // Search functionality - note that RedNote search API might be restricted
      const response = await axios.get(`${this.baseUrl}/v1/note/search`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Client-ID': this.clientId,
          'Content-Type': 'application/json',
        },
        params: {
          keyword,
          count: Math.min(count, 20),
          sort: 'general',
        },
      });

      const posts: SocialMediaPost[] = [];
      const notes = response.data?.data?.notes || [];
      
      for (const note of notes) {
        posts.push({
          id: note.note_id || '',
          platform: 'rednote',
          content: note.title + '\n' + (note.desc || ''),
          authorId: note.user?.user_id || '',
          authorName: note.user?.nickname || '',
          authorHandle: note.user?.red_id || '',
          createdAt: new Date(note.time * 1000 || Date.now()),
          engagement: {
            likes: note.interact_info?.liked_count || 0,
            shares: note.interact_info?.shared_count || 0,
            comments: note.interact_info?.comment_count || 0,
            views: note.interact_info?.view_count || 0,
          },
          media: this.extractMedia(note.image_list || []),
          hashtags: this.extractHashtags(note.desc || ''),
          mentions: this.extractMentions(note.desc || ''),
          url: `https://www.xiaohongshu.com/explore/${note.note_id}`,
        });
      }

      return posts;
    } catch (error) {
      console.error('Error searching RedNote posts:', error);
      throw error;
    }
  }

  // Note: RedNote posting requires special permissions and might not be available
  async postToRedNote(title: string, content: string, images: string[]): Promise<string> {
    try {
      // This would require RedNote's content publishing API which has strict approval requirements
      const response = await axios.post(`${this.baseUrl}/v1/note/post`, {
        title,
        desc: content,
        type: images.length > 0 ? 'normal' : 'text',
        image_list: images.map(url => ({ url })),
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Client-ID': this.clientId,
          'Content-Type': 'application/json',
        },
      });

      return response.data?.data?.note_id || '';
    } catch (error) {
      console.error('Error posting to RedNote:', error);
      throw new Error('RedNote posting requires special API permissions and approval');
    }
  }

  private extractMedia(imageList: any[]): any[] {
    return imageList.map(img => ({
      type: 'image' as const,
      url: img.url || img.url_default || '',
      thumbnailUrl: img.url_preview || img.url_default || '',
    }));
  }

  private extractHashtags(text: string): string[] {
    // RedNote uses #hashtag# format
    const hashtagRegex = /#([^#]+)#/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.replace(/#/g, '')) : [];
  }

  private extractMentions(text: string): string[] {
    // RedNote uses @username format
    const mentionRegex = /@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
  }
}