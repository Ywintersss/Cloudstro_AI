"use client";
import { useState } from "react";
import PlatformDetails from "../platformDetails/page"; // Import the new component

type Platform = "x" | "facebook" | "youtube" | null;

interface EngagementContentProps {
  onNavigate: (page: string) => void;
  onSetAnalysisContent: (content: any) => void;
}

export default function EngagementContent({
  onNavigate,
  onSetAnalysisContent,
}: EngagementContentProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);

  // Mock data for different platforms (for summary only)
  const platformData = {
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
    },
  };

  const totalStats = {
    totalLikes: Object?.values(platformData)?.reduce(
      (sum, platform) => sum + platform?.stats?.totalLikes,
      0
    ),
    totalComments: Object?.values(platformData)?.reduce(
      (sum, platform) => sum + platform?.stats?.comments,
      0
    ),
    totalShares: Object?.values(platformData)?.reduce(
      (sum, platform) => sum + platform?.stats?.shares,
      0
    ),
    avgEngagementRate:
      Object?.values(platformData)?.reduce(
        (sum, platform) => sum + platform?.stats?.engagementRate,
        0
      ) / Object?.values(platformData)?.length,
    totalPlatforms: Object?.keys(platformData)?.length,
  };

  // Get recent activity across all platforms
  const allComments = Object?.values(platformData)?.flatMap(
    (platform) => platform?.comments
  );
  const recentComments = allComments
    .sort((a, b) => {
      const timeA = a?.time?.includes("minute")
        ? parseInt(a?.time ?? "0")
        : a?.time?.includes("hour")
        ? parseInt(a?.time ?? "0") * 60
        : parseInt(a?.time ?? "0") * 1440;
      const timeB = b?.time?.includes("minute")
        ? parseInt(b?.time ?? "0")
        : b?.time?.includes("hour")
        ? parseInt(b?.time ?? "0") * 60
        : parseInt(b?.time ?? "0") * 1440;
      return timeA - timeB;
    })
    .slice(0, 3);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  const handleBackToOverview = () => {
    setSelectedPlatform(null);
  };

  // If a platform is selected, render the PlatformDetails component
  if (selectedPlatform) {
    return (
      <PlatformDetails
        platform={selectedPlatform}
        onBack={handleBackToOverview}
        onNavigateToAnalysis={(content) => {
          onSetAnalysisContent(content);
          onNavigate("analysis");
        }}
      />
    );
  }

  // Otherwise, render the main overview
  return (
    <div className="lg:px-8 lg:pt-8 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Engagement Analytics
        </h1>
      </div>

      {/* Overall Summary Section */}
      <div className="mb-4">
        <div
          className="p-3 lg:p-4"
          style={{
            borderRadius: "20px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800">
            <span>🌟</span>
            Overall Performance Summary
          </h2>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <div className="bg-gray-50 rounded-md p-2 text-center border border-gray-200">
              <p className="text-xs mb-1 text-gray-600">Total Likes</p>
              <p className="text-base lg:text-lg font-bold text-red-500">
                {totalStats?.totalLikes?.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">
                Across {totalStats?.totalPlatforms} platforms
              </p>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center border border-gray-200">
              <p className="text-xs mb-1 text-gray-600">Total Comments</p>
              <p className="text-base lg:text-lg font-bold text-blue-500">
                {totalStats?.totalComments}
              </p>
              <p className="text-xs text-green-600">Active conversations</p>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center border border-gray-200">
              <p className="text-xs mb-1 text-gray-600">Total Shares</p>
              <p className="text-base lg:text-lg font-bold text-green-500">
                {totalStats?.totalShares}
              </p>
              <p className="text-xs text-green-600">Content distributed</p>
            </div>
            <div className="bg-gray-50 rounded-md p-2 text-center border border-gray-200">
              <p className="text-xs mb-1 text-gray-600">Avg Engagement</p>
              <p className="text-base lg:text-lg font-bold text-purple-500">
                {totalStats?.avgEngagementRate?.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">Cross-platform rate</p>
            </div>
          </div>

          {/* Platform Breakdown */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-800">
                <span>📊</span>
                Platform Breakdown
              </h3>
              <div className="space-y-1">
                {Object?.entries(platformData)?.map(([key, platform]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 rounded-md p-2 border border-gray-200"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{platform?.icon}</span>
                      <span className="font-medium text-xs text-gray-800">
                        {platform?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs text-gray-800">
                        {platform?.stats?.engagementRate}%
                      </p>
                      <p className="text-xs text-gray-600">
                        {platform?.stats?.comments} comments
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-gray-800">
                <span>⚡</span>
                Recent Activity
              </h3>
              <div className="space-y-1">
                {recentComments?.map((comment, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-md p-2 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-xs text-gray-800">
                        @{comment?.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comment?.time}
                      </span>
                    </div>
                    <p className="text-xs truncate text-gray-700">
                      {comment?.comment}
                    </p>
                    <span className="text-xs text-gray-500">
                      {comment?.platform}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          {
            platform: "x" as Platform,
            name: "X (Twitter)",
            icon: "🐦",
            color: "bg-black hover:bg-gray-800",
          },
          {
            platform: "facebook" as Platform,
            name: "Facebook",
            icon: "📘",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            platform: "youtube" as Platform,
            name: "YouTube",
            icon: "📺",
            color: "bg-red-600 hover:bg-red-700",
          },
        ]?.map((item) => (
          <button
            key={item?.platform}
            onClick={() => handlePlatformSelect(item?.platform)}
            className={`flex items-center gap-3 px-6 py-3 text-white rounded-lg font-medium transition-all transform hover:scale-105 ${item?.color}`}
          >
            <span className="text-xl">{item?.icon}</span>
            <span>{item?.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
