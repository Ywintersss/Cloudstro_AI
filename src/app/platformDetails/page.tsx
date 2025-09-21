import { useState, useEffect } from "react";
import Image from "next/image";
import { BarChart3, X, Minimize2, Sparkles, TrendingUp } from "lucide-react";

type Platform = "x" | "facebook" | "youtube";

interface Analytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagementRate: number;
  topCountries: string[];
  ageGroups: Record<string, number>;
  hourlyEngagement: number[];
}

interface ContentItem {
  id: number;
  title: string;
  type: string;
  date: string;
  engagement: string;
  status: string;
  analytics?: Analytics;
}

interface Comment {
  id: number;
  user: string;
  comment: string;
  platform: string;
  time: string;
  type: "positive" | "negative" | "question";
}

interface TopPost {
  title: string;
  engagement: string;
  time: string;
}

interface SuccessFactor {
  factor: string;
  description: string;
}

interface PlatformStats {
  totalLikes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

interface PlatformData {
  name: string;
  icon: string;
  stats: PlatformStats;
  comments: Comment[];
  topPosts: TopPost[];
  successFactors: SuccessFactor[];
  allContent: ContentItem[];
}

interface PlatformDetailsProps {
  platform: Platform;
  onBack: () => void;
  onNavigateToAnalysis?: (content: ContentItem) => void;
}

// AI Analysis Widget Component for Analytics Modal
const AIAnalysisWidget = ({
  analyticsContent,
  platform,
  onNavigateToAnalysis,
}: {
  analyticsContent: ContentItem;
  platform: Platform;
  onNavigateToAnalysis?: (content: ContentItem) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleAnalysisRedirect = () => {
    console.log(
      `Redirecting to analysis with ${platform} content data:`,
      analyticsContent
    );

    if (onNavigateToAnalysis) {
      onNavigateToAnalysis(analyticsContent);
    } else {
      alert(
        `Would redirect to /analysis with detailed AI insights for: "${analyticsContent.title}"`
      );
    }
  };

  const getInsightPreview = () => {
    if (!analyticsContent.analytics)
      return "No analytics data available for AI analysis.";

    const { engagementRate, views, likes } = analyticsContent.analytics;
    if (engagementRate > 10) {
      return `High-performing content! ${engagementRate}% engagement rate suggests strong audience connection. Let me analyze what made this successful.`;
    } else if (engagementRate > 5) {
      return `Solid performance with ${engagementRate}% engagement. I can identify optimization opportunities from your ${views.toLocaleString()} views.`;
    } else {
      return `This content has growth potential. With ${views.toLocaleString()} views but ${engagementRate}% engagement, let's find improvement strategies.`;
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none"
          >
            <div className="relative">
              <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
          </button>
        )}

        {isOpen && (
          <div
            className={`bg-white rounded-xl shadow-2xl transition-all duration-300 ${
              isMinimized ? "w-80 h-12" : "w-80 h-auto max-h-[400px]"
            } border border-gray-200`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-t-xl flex items-center justify-between">
              <h3 className="font-semibold flex items-center text-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                AI Content Analysis
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="p-4 space-y-3">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-semibold text-xs text-gray-800 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-purple-600" />
                    Content: {analyticsContent.title}
                  </h4>
                  {analyticsContent.analytics && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-purple-600">
                          {analyticsContent.analytics.views.toLocaleString()}
                        </p>
                        <p className="text-gray-600">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-blue-600">
                          {analyticsContent.analytics.engagementRate}%
                        </p>
                        <p className="text-gray-600">Engagement</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-600">
                          {analyticsContent.analytics.likes}
                        </p>
                        <p className="text-gray-600">Likes</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    AI Insight:
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {getInsightPreview()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleAnalysisRedirect}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-3 rounded-lg transition-all duration-200 font-medium text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <BarChart3 className="w-3 h-3" />
                    Deep AI Analysis
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    Get comprehensive insights for this content
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <h4 className="text-xs font-semibold text-blue-800 mb-1">
                    Analysis includes:
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-0.5">
                    <li>• Performance vs similar content</li>
                    <li>• Audience engagement patterns</li>
                    <li>• Optimization recommendations</li>
                    <li>• Content strategy insights</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default function PlatformDetails({
  platform,
  onBack,
  onNavigateToAnalysis,
}: PlatformDetailsProps) {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [analyticsContent, setAnalyticsContent] = useState<ContentItem | null>(
    null
  );
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);

  // Mock data for different platforms
  const platformData: Record<Platform, PlatformData> = {
    x: {
      name: "X (Twitter)",
      icon: "🐦",
      stats: {
        totalLikes: 1247,
        comments: 189,
        shares: 156,
        engagementRate: 6.2,
      },
      comments: [
        {
          id: 1,
          user: "tech_guru",
          comment: "This thread is incredibly insightful!",
          platform: "X",
          time: "1 hour ago",
          type: "positive",
        },
        {
          id: 2,
          user: "startup_jane",
          comment: "Can you share more about the implementation?",
          platform: "X",
          time: "3 hours ago",
          type: "question",
        },
        {
          id: 3,
          user: "dev_mike",
          comment: "Amazing work on this project!",
          platform: "X",
          time: "5 hours ago",
          type: "positive",
        },
        {
          id: 4,
          user: "critic_bob",
          comment: "I'm not convinced this approach is scalable",
          platform: "X",
          time: "7 hours ago",
          type: "negative",
        },
      ],
      topPosts: [
        {
          title: "AI development best practices thread",
          engagement: "456 interactions",
          time: "2 hours ago",
        },
        {
          title: "Tech industry insights",
          engagement: "312 interactions",
          time: "1 day ago",
        },
        {
          title: "Startup funding tips",
          engagement: "267 interactions",
          time: "2 days ago",
        },
      ],
      successFactors: [
        { factor: "Timing", description: "Posted during peak hours (9-10 AM)" },
        { factor: "Hashtags", description: "Used trending #AI and #TechTips" },
        {
          factor: "Thread format",
          description: "Broke complex topic into digestible parts",
        },
        {
          factor: "Call to action",
          description: "Asked followers to share experiences",
        },
      ],
      allContent: [
        {
          id: 1,
          title: "AI development best practices thread",
          type: "Thread",
          date: "2024-01-15",
          engagement: "456 interactions",
          status: "Published",
          analytics: {
            views: 5420,
            likes: 312,
            comments: 89,
            shares: 55,
            impressions: 8930,
            engagementRate: 8.4,
            topCountries: ["USA", "Canada", "UK"],
            ageGroups: { "25-34": 35, "35-44": 28, "18-24": 20, "45-54": 17 },
            hourlyEngagement: [
              2, 1, 0, 0, 0, 1, 3, 8, 15, 22, 18, 12, 8, 6, 9, 14, 19, 21, 16,
              11, 7, 4, 3, 2,
            ],
          },
        },
        {
          id: 2,
          title: "Tech industry insights",
          type: "Tweet",
          date: "2024-01-14",
          engagement: "312 interactions",
          status: "Published",
          analytics: {
            views: 3240,
            likes: 189,
            comments: 67,
            shares: 56,
            impressions: 6150,
            engagementRate: 9.6,
            topCountries: ["USA", "India", "Germany"],
            ageGroups: { "25-34": 42, "35-44": 25, "18-24": 18, "45-54": 15 },
            hourlyEngagement: [
              1, 0, 0, 0, 0, 2, 4, 12, 18, 28, 22, 15, 10, 8, 11, 16, 24, 26,
              19, 13, 8, 5, 3, 1,
            ],
          },
        },
        {
          id: 3,
          title: "Startup funding tips",
          type: "Thread",
          date: "2024-01-13",
          engagement: "267 interactions",
          status: "Published",
        },
        {
          id: 4,
          title: "Morning motivation quote",
          type: "Tweet",
          date: "2024-01-12",
          engagement: "89 interactions",
          status: "Published",
        },
        {
          id: 5,
          title: "Weekend project showcase",
          type: "Tweet + Media",
          date: "2024-01-11",
          engagement: "145 interactions",
          status: "Published",
        },
      ],
    },
    facebook: {
      name: "Facebook",
      icon: "📘",
      stats: {
        totalLikes: 2156,
        comments: 234,
        shares: 189,
        engagementRate: 8.4,
      },
      comments: [
        {
          id: 1,
          user: "family_friend",
          comment: "Love seeing your business grow!",
          platform: "Facebook",
          time: "2 hours ago",
          type: "positive",
        },
        {
          id: 2,
          user: "local_customer",
          comment: "When will this be available in our area?",
          platform: "Facebook",
          time: "4 hours ago",
          type: "question",
        },
        {
          id: 3,
          user: "community_member",
          comment: "Great to see local innovation!",
          platform: "Facebook",
          time: "6 hours ago",
          type: "positive",
        },
        {
          id: 4,
          user: "skeptical_user",
          comment: "Seems too good to be true",
          platform: "Facebook",
          time: "8 hours ago",
          type: "negative",
        },
      ],
      topPosts: [
        {
          title: "Community event announcement",
          engagement: "623 interactions",
          time: "3 hours ago",
        },
        {
          title: "Customer success story",
          engagement: "445 interactions",
          time: "1 day ago",
        },
        {
          title: "Behind the scenes photos",
          engagement: "378 interactions",
          time: "3 days ago",
        },
      ],
      successFactors: [
        {
          factor: "Visual content",
          description: "High-quality photos increased engagement by 40%",
        },
        {
          factor: "Community focus",
          description: "Local content resonated with audience",
        },
        {
          factor: "User-generated content",
          description: "Customer stories built trust",
        },
        {
          factor: "Interactive posts",
          description: "Questions and polls drove comments",
        },
      ],
      allContent: [
        {
          id: 1,
          title: "Community event announcement",
          type: "Event",
          date: "2024-01-15",
          engagement: "623 interactions",
          status: "Published",
          analytics: {
            views: 8340,
            likes: 445,
            comments: 123,
            shares: 55,
            impressions: 12450,
            engagementRate: 7.5,
            topCountries: ["USA", "Canada", "Mexico"],
            ageGroups: { "35-44": 35, "25-34": 28, "45-54": 22, "18-24": 15 },
            hourlyEngagement: [
              3, 1, 0, 0, 0, 2, 5, 12, 20, 35, 28, 18, 14, 12, 15, 22, 28, 32,
              25, 18, 12, 8, 5, 3,
            ],
          },
        },
        {
          id: 2,
          title: "Customer success story",
          type: "Post + Photos",
          date: "2024-01-14",
          engagement: "445 interactions",
          status: "Published",
          analytics: {
            views: 6720,
            likes: 312,
            comments: 89,
            shares: 44,
            impressions: 9890,
            engagementRate: 6.6,
            topCountries: ["USA", "UK", "Canada"],
            ageGroups: { "25-34": 40, "35-44": 30, "18-24": 18, "45-54": 12 },
            hourlyEngagement: [
              2, 0, 0, 0, 0, 1, 3, 8, 15, 25, 22, 16, 11, 9, 12, 18, 24, 26, 20,
              14, 9, 6, 4, 2,
            ],
          },
        },
        {
          id: 3,
          title: "Behind the scenes photos",
          type: "Photo Album",
          date: "2024-01-13",
          engagement: "378 interactions",
          status: "Published",
        },
        {
          id: 4,
          title: "Product showcase video",
          type: "Video",
          date: "2024-01-12",
          engagement: "291 interactions",
          status: "Published",
        },
        {
          id: 5,
          title: "Team introduction post",
          type: "Post + Photos",
          date: "2024-01-11",
          engagement: "156 interactions",
          status: "Published",
        },
      ],
    },
    youtube: {
      name: "YouTube",
      icon: "📺",
      stats: {
        totalLikes: 3892,
        comments: 456,
        shares: 234,
        engagementRate: 12.1,
      },
      comments: [
        {
          id: 1,
          user: "video_enthusiast",
          comment: "This tutorial helped me so much! Thank you!",
          platform: "YouTube",
          time: "30 minutes ago",
          type: "positive",
        },
        {
          id: 2,
          user: "learning_student",
          comment:
            "Could you make a follow-up video about advanced techniques?",
          platform: "YouTube",
          time: "2 hours ago",
          type: "question",
        },
        {
          id: 3,
          user: "creative_mind",
          comment: "Your editing style is fantastic!",
          platform: "YouTube",
          time: "4 hours ago",
          type: "positive",
        },
        {
          id: 4,
          user: "harsh_reviewer",
          comment: "The audio quality could be better",
          platform: "YouTube",
          time: "6 hours ago",
          type: "negative",
        },
      ],
      topPosts: [
        {
          title: "Complete tutorial series finale",
          engagement: "1247 interactions",
          time: "1 hour ago",
        },
        {
          title: "Product review and comparison",
          engagement: "892 interactions",
          time: "2 days ago",
        },
        {
          title: "Live Q&A session highlights",
          engagement: "667 interactions",
          time: "4 days ago",
        },
      ],
      successFactors: [
        {
          factor: "Thumbnail design",
          description: "Bright colors and clear text increased CTR by 25%",
        },
        {
          factor: "Video length",
          description: "8-12 minute videos had highest retention",
        },
        {
          factor: "Hook in first 15 seconds",
          description: "Strong opening reduced drop-off rate",
        },
        {
          factor: "SEO optimization",
          description: "Keyword-rich titles improved discoverability",
        },
      ],
      allContent: [
        {
          id: 1,
          title: "Complete tutorial series finale",
          type: "Tutorial",
          date: "2024-01-15",
          engagement: "1247 interactions",
          status: "Published",
          analytics: {
            views: 15420,
            likes: 892,
            comments: 234,
            shares: 121,
            impressions: 23680,
            engagementRate: 8.1,
            topCountries: ["USA", "India", "UK"],
            ageGroups: { "18-24": 45, "25-34": 32, "35-44": 15, "45-54": 8 },
            hourlyEngagement: [
              1, 0, 0, 0, 0, 2, 4, 8, 18, 32, 45, 38, 28, 22, 25, 35, 42, 48,
              35, 25, 15, 8, 4, 2,
            ],
          },
        },
        {
          id: 2,
          title: "Product review and comparison",
          type: "Review",
          date: "2024-01-14",
          engagement: "892 interactions",
          status: "Published",
          analytics: {
            views: 12350,
            likes: 567,
            comments: 198,
            shares: 127,
            impressions: 18900,
            engagementRate: 7.2,
            topCountries: ["USA", "Germany", "Australia"],
            ageGroups: { "25-34": 38, "18-24": 28, "35-44": 22, "45-54": 12 },
            hourlyEngagement: [
              2, 1, 0, 0, 0, 1, 3, 12, 22, 28, 35, 32, 25, 20, 23, 30, 38, 42,
              32, 22, 16, 10, 6, 3,
            ],
          },
        },
        {
          id: 3,
          title: "Live Q&A session highlights",
          type: "Live Stream",
          date: "2024-01-13",
          engagement: "667 interactions",
          status: "Published",
        },
        {
          id: 4,
          title: "Behind the scenes vlog",
          type: "Vlog",
          date: "2024-01-12",
          engagement: "445 interactions",
          status: "Published",
        },
        {
          id: 5,
          title: "Quick tips compilation",
          type: "Educational",
          date: "2024-01-11",
          engagement: "523 interactions",
          status: "Published",
        },
      ],
    },
  };

  const currentPlatformData = platformData[platform];

  const filteredComments = currentPlatformData.comments.filter((comment) => {
    if (filterType === "all") return true;
    return comment.type === filterType;
  });

  const handleCommentSelect = (commentId: number) => {
    setSelectedComments((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  };

  const handleViewAnalytics = (content: ContentItem) => {
    if (content.analytics) {
      setAnalyticsContent(content);
      setIsAnalyticsOpen(true);
    }
  };

  const closeAnalytics = () => {
    setIsAnalyticsOpen(false);
    setAnalyticsContent(null);
  };

  const handleBulkReply = () => {
    console.log(
      `Replying "${replyText}" to ${selectedComments.length} comments`
    );
    setReplyText("");
    setSelectedComments([]);
  };

  const handleNavigateToAnalysis = (content: ContentItem) => {
    if (onNavigateToAnalysis) {
      onNavigateToAnalysis(content);
    }
  };

  // Analytics Modal Component
  const AnalyticsModal = () => {
    if (!isAnalyticsOpen || !analyticsContent) return null;

    // Handle case where content has no analytics
    if (!analyticsContent.analytics) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
              <button
                onClick={closeAnalytics}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">
                No analytics available for this content
              </p>
              <p className="text-sm text-gray-400">{analyticsContent.title}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex flex-row gap-5">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <span className="text-3xl">
                        {currentPlatformData.icon}
                      </span>
                      Analytics
                    </h2>
                    {/* AI Widget Button in Header */}
                    <button
                      onClick={() => {
                        if (analyticsContent) {
                          handleNavigateToAnalysis(analyticsContent);
                        }
                      }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <Sparkles className="w-4 h-4" />
                      AI Analysis
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-medium text-gray-700">
                      {analyticsContent.title}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {analyticsContent.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {analyticsContent.date}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeAnalytics}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4"
              >
                ×
              </button>
            </div>
          </div>

          {/* Analytics Content - Unified Layout */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Key Metrics - Full Width */}
              <div className="p-6 bg-gray-50 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="text-xl font-bold text-blue-500">
                      {analyticsContent.analytics.views.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Likes</p>
                    <p className="text-xl font-bold text-red-500">
                      {analyticsContent.analytics.likes.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Comments</p>
                    <p className="text-xl font-bold text-green-500">
                      {analyticsContent.analytics.comments}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Shares</p>
                    <p className="text-xl font-bold text-purple-500">
                      {analyticsContent.analytics.shares}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-xl font-bold text-orange-500">
                      {analyticsContent.analytics.impressions.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-xl font-bold text-indigo-500">
                      {analyticsContent.analytics.engagementRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Data Row with Comments */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Side - Comments Management */}
                <div className="lg:col-span-1">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        💬 Comments
                      </h3>
                    </div>

                    {/* Filter Controls */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Filter:
                        </label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="all">All</option>
                          <option value="positive">Positive</option>
                          <option value="negative">Negative</option>
                          <option value="question">Questions</option>
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {selectedComments.length} selected
                      </div>

                      {selectedComments.length > 0 && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Reply..."
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleBulkReply}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Comments List */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredComments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-2 rounded border text-xs transition-colors ${
                            selectedComments.includes(comment.id)
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedComments.includes(comment.id)}
                              onChange={() => handleCommentSelect(comment.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-800">
                                  @{comment.user}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {comment.time}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-1">
                                {comment.comment}
                              </p>
                              <span
                                className={`px-2 py-1 text-xs rounded ${
                                  comment.type === "positive"
                                    ? "bg-green-100 text-green-800"
                                    : comment.type === "negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {comment.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Analytics Data */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top Countries */}
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Top Countries
                      </h3>
                      <div className="space-y-3">
                        {analyticsContent.analytics.topCountries.map(
                          (country, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-700">
                                {country}
                              </span>
                              <div className="flex items-center">
                                <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                                  <div
                                    className="h-2 bg-blue-500 rounded-full"
                                    style={{ width: `${(3 - index) * 33}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 w-8">
                                  {(3 - index) * 33}%
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Age Demographics */}
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Age Demographics
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(
                          analyticsContent.analytics.ageGroups
                        ).map(([age, percentage]) => (
                          <div
                            key={age}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-700">{age}</span>
                            <div className="flex items-center">
                              <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                                <div
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 w-8">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hourly Engagement */}
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Hourly Engagement
                      </h3>
                      <div className="grid grid-cols-12 gap-1 mb-3">
                        {analyticsContent.analytics.hourlyEngagement.map(
                          (value, hour) => (
                            <div key={hour} className="text-center">
                              <div
                                className="w-full bg-blue-500 rounded-t mb-1"
                                style={{
                                  height: `${Math.max(value * 1.5, 2)}px`,
                                }}
                              ></div>
                              <span className="text-xs text-gray-500">
                                {hour}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Peak engagement varies by content
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Top Posts and Success Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Posts */}
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    🏆 Top Posts
                  </h3>
                  <div className="space-y-2">
                    {currentPlatformData.topPosts
                      .slice(0, 3)
                      .map((post, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded border border-gray-200"
                        >
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {post.title}
                          </p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{post.time}</span>
                            <span className="text-blue-600">
                              {post.engagement}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Success Factors */}
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    📈 Success
                  </h3>
                  <div className="space-y-2">
                    {currentPlatformData.successFactors
                      .slice(0, 3)
                      .map((factor, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded border border-gray-200"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 mb-1">
                                {factor.factor}
                              </p>
                              <p className="text-xs text-gray-600">
                                {factor.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis Widget - Only shows when analytics modal is open */}
        {analyticsContent && (
          <AIAnalysisWidget
            analyticsContent={analyticsContent}
            platform={platform}
            onNavigateToAnalysis={onNavigateToAnalysis}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span>←</span>
          Back to Overview
        </button>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-4xl">{currentPlatformData.icon}</span>
          {currentPlatformData.name} Analytics
        </h1>
      </div>

      {/* Platform Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className="p-6 text-center"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <p className="text-sm text-gray-600 mb-2">Total Likes</p>
          <p className="text-2xl font-bold text-blue-600">
            {currentPlatformData.stats.totalLikes.toLocaleString()}
          </p>
        </div>
        <div
          className="p-6 text-center"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <p className="text-sm text-gray-600 mb-2">Comments</p>
          <p className="text-2xl font-bold text-green-600">
            {currentPlatformData.stats.comments}
          </p>
        </div>
        <div
          className="p-6 text-center"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <p className="text-sm text-gray-600 mb-2">Shares</p>
          <p className="text-2xl font-bold text-purple-600">
            {currentPlatformData.stats.shares}
          </p>
        </div>
        <div
          className="p-6 text-center"
          style={{
            borderRadius: "24px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <p className="text-sm text-gray-600 mb-2">Engagement Rate</p>
          <p className="text-2xl font-bold text-orange-600">
            {currentPlatformData.stats.engagementRate}%
          </p>
        </div>
      </div>

      {/* Recommendation Time Card */}
          <div
            className="p-4 lg:p-6 flex-1 mb-8"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                ⏰ Recommendation Time
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">Best Time</p>
                <p className="text-lg font-bold text-blue-600">
                  {(() => {
                    // Find the most active hour from all analytics
                    const hours: number[] = [];
                    currentPlatformData.allContent.forEach(content => {
                      if (content.analytics?.hourlyEngagement) {
                        content.analytics.hourlyEngagement.forEach((val, hour) => {
                          hours[hour] = (hours[hour] || 0) + val;
                        });
                      }
                    });
                    if (hours.length === 0) return "N/A";
                    const maxHour = hours.indexOf(Math.max(...hours));
                    // Format hour as AM/PM
                    const hourStr = maxHour === 0 ? "12:00 AM" : maxHour < 12 ? `${maxHour}:00 AM` : maxHour === 12 ? "12:00 PM" : `${maxHour-12}:00 PM`;
                    return hourStr;
                  })()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Peak Day</p>
                <p className="text-lg font-bold text-green-600">
                  {(() => {
                    // Find the most common day from all content dates
                    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    const dayCounts: Record<string, number> = {};
                    currentPlatformData.allContent.forEach(content => {
                      const d = new Date(content.date);
                      const day = days[d.getDay()];
                      dayCounts[day] = (dayCounts[day] || 0) + 1;
                    });
                    const peakDay = Object.entries(dayCounts).sort((a,b) => b[1]-a[1])[0];
                    return peakDay ? peakDay[0] : "N/A";
                  })()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Engagement</p>
                <p className="text-lg font-bold text-purple-600">
                  {(() => {
                    // Average engagement rate from analytics
                    const rates = currentPlatformData.allContent.map(c => c.analytics?.engagementRate).filter(Boolean) as number[];
                    if (rates.length === 0) return "N/A";
                    const avg = rates.reduce((a,b) => a+b,0)/rates.length;
                    return `${avg.toFixed(1)}%`;
                  })()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Reach</p>
                <p className="text-lg font-bold text-orange-600">
                  {(() => {
                    // Sum of all views from analytics
                    const views = currentPlatformData.allContent.map(c => c.analytics?.views).filter(Boolean) as number[];
                    if (views.length === 0) return "N/A";
                    const total = views.reduce((a,b) => a+b,0);
                    return total >= 1000 ? `${(total/1000).toFixed(1)}K` : total.toString();
                  })()}
                </p>
              </div>
            </div>
          </div>

      {/* AI Platform Insights Section */}
      <div
        className="p-6 mb-8"
        style={{
          borderRadius: "36px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "2px solid #e0e0e0",
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Image src="/logo.svg" alt="AI Icon" width={20} height={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              AI Platform Insights
            </h3>
            <p className="text-white/80 text-sm">
              AI-powered analysis of your {currentPlatformData.name} performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-white/90">
                <span>Platform Score:</span>
                <span className="font-bold text-green-300">
                  {currentPlatformData.stats.engagementRate >= 10
                    ? "Excellent"
                    : currentPlatformData.stats.engagementRate >= 7
                    ? "Good"
                    : currentPlatformData.stats.engagementRate >= 5
                    ? "Average"
                    : "Needs Improvement"}
                </span>
              </div>
              <div className="flex justify-between items-center text-white/90">
                <span>Content Quality:</span>
                <span className="font-bold text-blue-300">
                  {currentPlatformData.allContent.filter(
                    (c) =>
                      c.analytics?.engagementRate &&
                      c.analytics.engagementRate > 8
                  ).length > 0
                    ? "High"
                    : "Moderate"}
                </span>
              </div>
              <div className="flex justify-between items-center text-white/90">
                <span>Audience Engagement:</span>
                <span className="font-bold text-purple-300">
                  {currentPlatformData.stats.comments > 300
                    ? "Very Active"
                    : currentPlatformData.stats.comments > 150
                    ? "Active"
                    : "Moderate"}
                </span>
              </div>
            </div>
          </div>

          {/* Key Strengths */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Key Strengths
            </h4>
            <div className="space-y-2">
              {(() => {
                const strengths = [];
                if (currentPlatformData.stats.engagementRate > 8) {
                  strengths.push(
                    "High engagement rate drives strong community connection"
                  );
                }
                if (currentPlatformData.stats.shares > 150) {
                  strengths.push(
                    "Content highly shareable, expanding organic reach"
                  );
                }
                if (currentPlatformData.stats.comments > 200) {
                  strengths.push("Strong community interaction and discussion");
                }
                if (strengths.length === 0) {
                  strengths.push(
                    "Consistent content publishing",
                    "Building audience base",
                    "Establishing platform presence"
                  );
                }
                return strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-white/90">{strength}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {(() => {
                const recommendations = [];
                if (currentPlatformData.stats.engagementRate < 5) {
                  recommendations.push(
                    "Focus on more interactive content formats"
                  );
                } else if (currentPlatformData.stats.engagementRate < 8) {
                  recommendations.push(
                    "Experiment with posting times and content types"
                  );
                }
                if (currentPlatformData.stats.shares < 100) {
                  recommendations.push(
                    "Add clear call-to-actions to boost sharing"
                  );
                }
                if (currentPlatformData.stats.comments < 150) {
                  recommendations.push(
                    "Ask more questions to spark discussions"
                  );
                }

                // Platform-specific recommendations
                if (platform === "x") {
                  recommendations.push(
                    "Utilize trending hashtags for broader reach"
                  );
                } else if (platform === "facebook") {
                  recommendations.push(
                    "Share behind-the-scenes content for authenticity"
                  );
                } else if (platform === "youtube") {
                  recommendations.push(
                    "Optimize thumbnails for higher click-through rates"
                  );
                }

                return recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-white/90">{rec}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Overall Platform Analysis - Dropdown */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <button
            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <h4 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Platform Analysis Summary
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded-full">
                AI Generated
              </span>
              <div
                className={`transform transition-transform duration-200 ${
                  isAnalyticsOpen ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </button>

          {isAnalyticsOpen && (
            <div className="p-4 border-t border-white/10">
              <p className="text-white/90 text-sm leading-relaxed">
                {(() => {
                  const totalLikes = currentPlatformData.stats.totalLikes;
                  const engagementRate =
                    currentPlatformData.stats.engagementRate;
                  const contentCount = currentPlatformData.allContent.length;

                  if (engagementRate >= 10) {
                    return `Your ${
                      currentPlatformData.name
                    } presence is performing exceptionally well with ${totalLikes.toLocaleString()} total likes and ${engagementRate}% engagement rate. Your ${contentCount} pieces of content demonstrate strong audience connection and viral potential. This platform should be a key focus area for content expansion.`;
                  } else if (engagementRate >= 7) {
                    return `${
                      currentPlatformData.name
                    } shows solid performance with ${totalLikes.toLocaleString()} total likes across ${contentCount} posts. Your ${engagementRate}% engagement rate indicates good audience resonance. With strategic optimization, this platform has strong growth potential.`;
                  } else if (engagementRate >= 5) {
                    return `Your ${
                      currentPlatformData.name
                    } account shows moderate performance with ${totalLikes.toLocaleString()} total likes. The ${engagementRate}% engagement rate suggests room for improvement through content optimization and audience targeting strategies.`;
                  } else {
                    return `${
                      currentPlatformData.name
                    } presents an opportunity for growth. While you have ${contentCount} posts and ${totalLikes.toLocaleString()} total likes, the ${engagementRate}% engagement rate indicates potential for significant improvement through strategic content refinement.`;
                  }
                })()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content List - Now Full Width */}
      <div
        className="p-4 lg:p-6"
        style={{
          borderRadius: "36px",
          background: "#ffffff",
          border: "2px solid #e0e0e0",
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">📋 All Content</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentPlatformData.allContent.length} posts
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPlatformData.allContent.map((content) => (
            <div
              key={content.id}
              className="p-4 rounded-lg border bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleViewAnalytics(content)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {content.title}
                  </p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {content.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {content.date}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    content.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {content.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-blue-600">
                  {content.engagement}
                </span>
                <span className="text-xs text-gray-500">
                  {content.analytics
                    ? "📊 Analytics Available"
                    : "No Analytics"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal />
    </div>
  );
}
