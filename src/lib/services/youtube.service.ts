import axios from 'axios';
import { SocialMediaPost } from '../../types/social-media';
import { socialMediaConfig, API_ENDPOINTS } from '../../config/social-media';

export class YouTubeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = socialMediaConfig.youtube.apiKey;
    this.baseUrl = API_ENDPOINTS.youtube.baseUrl;
  }

  async getChannelVideos(channelId: string, count: number = 50): Promise<SocialMediaPost[]> {
    try {
      // First, get the uploads playlist ID for the channel
      const channelResponse = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'contentDetails',
          id: channelId,
          key: this.apiKey,
        },
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      // Get videos from the uploads playlist
      const videosResponse = await axios.get(`${this.baseUrl}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults: Math.min(count, 50),
          key: this.apiKey,
        },
      });

      // Get video statistics for engagement data
      const videoIds = videosResponse.data.items.map((item: any) => item.snippet?.resourceId?.videoId).join(',');
      
      const statsResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'statistics,snippet',
          id: videoIds,
          key: this.apiKey,
        },
      });

      return videosResponse.data.items.map((item: any, index: number) => {
        const stats = statsResponse.data.items[index]?.statistics || {};
        const videoSnippet = statsResponse.data.items[index]?.snippet || item.snippet;
        
        return {
          id: item.snippet?.resourceId?.videoId,
          platform: 'youtube' as const,
          content: videoSnippet.title + (videoSnippet.description ? '\n\n' + videoSnippet.description.substring(0, 500) : ''),
          authorId: item.snippet?.channelId,
          authorName: item.snippet?.channelTitle,
          authorHandle: item.snippet?.channelTitle,
          createdAt: new Date(item.snippet.publishedAt),
          engagement: {
            likes: parseInt(stats.likeCount || '0'),
            shares: 0, // YouTube API doesn't provide share count directly
            comments: parseInt(stats.commentCount || '0'),
            views: parseInt(stats.viewCount || '0'),
          },
          media: [{
            type: 'video' as const,
            url: `https://www.youtube.com/watch?v=${item.snippet?.resourceId?.videoId}`,
            thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
          }],
          hashtags: this.extractHashtags(videoSnippet.description || ''),
          mentions: this.extractMentions(videoSnippet.description || ''),
          url: `https://www.youtube.com/watch?v=${item.snippet?.resourceId?.videoId}`,
        };
      });
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  }

  async getVideoById(videoId: string): Promise<SocialMediaPost | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: this.apiKey,
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        return null;
      }

      const video = response.data.items[0];
      const stats = video.statistics || {};

      return {
        id: video.id,
        platform: 'youtube' as const,
        content: video.snippet.title + (video.snippet.description ? '\n\n' + video.snippet.description.substring(0, 500) : ''),
        authorId: video.snippet.channelId,
        authorName: video.snippet.channelTitle,
        authorHandle: video.snippet.channelTitle,
        createdAt: new Date(video.snippet.publishedAt),
        engagement: {
          likes: parseInt(stats.likeCount || '0'),
          shares: 0,
          comments: parseInt(stats.commentCount || '0'),
          views: parseInt(stats.viewCount || '0'),
        },
        media: [{
          type: 'video' as const,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
        }],
        hashtags: this.extractHashtags(video.snippet.description || ''),
        mentions: this.extractMentions(video.snippet.description || ''),
        url: `https://www.youtube.com/watch?v=${video.id}`,
      };
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      return null;
    }
  }

  async searchVideos(query: string, count: number = 25): Promise<SocialMediaPost[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: Math.min(count, 50),
          order: 'relevance',
          key: this.apiKey,
        },
      });

      // Get video IDs to fetch statistics
      const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');
      
      const statsResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'statistics',
          id: videoIds,
          key: this.apiKey,
        },
      });

      return response.data.items.map((item: any, index: number) => {
        const stats = statsResponse.data.items[index]?.statistics || {};
        
        return {
          id: item.id.videoId,
          platform: 'youtube' as const,
          content: item.snippet.title + (item.snippet.description ? '\n\n' + item.snippet.description.substring(0, 500) : ''),
          authorId: item.snippet.channelId,
          authorName: item.snippet.channelTitle,
          authorHandle: item.snippet.channelTitle,
          createdAt: new Date(item.snippet.publishedAt),
          engagement: {
            likes: parseInt(stats.likeCount || '0'),
            shares: 0,
            comments: parseInt(stats.commentCount || '0'),
            views: parseInt(stats.viewCount || '0'),
          },
          media: [{
            type: 'video' as const,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          }],
          hashtags: this.extractHashtags(item.snippet.description || ''),
          mentions: this.extractMentions(item.snippet.description || ''),
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        };
      });
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    }
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
  }

  private extractMentions(text: string): string[] {
    // YouTube doesn't have traditional mentions, but we can look for channel references
    const mentionRegex = /@[\w]+/g;
    return text.match(mentionRegex) || [];
  }

  async getChannelInfo(channelId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: this.apiKey,
        },
      });

      return response.data.items[0] || null;
    } catch (error) {
      console.error('Error fetching YouTube channel info:', error);
      return null;
    }
  }
}