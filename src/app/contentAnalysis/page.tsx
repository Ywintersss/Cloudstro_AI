"use client";
import React, { useState } from "react";
import { useEffect } from "react";

export default function ContentAnalysisPage({
  analysisContent,
}: {
  analysisContent: any;
}) {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    if (analysisContent && analysisContent.analytics) {
      setUrl(`Analyzing: ${analysisContent.title}`);

      const convertedData = {
        title: analysisContent.title,
        platform: "Social Media Platform",
        hitScore: Math.round(analysisContent.analytics.engagementRate * 10),
        peakTime: `${analysisContent.date} at peak hours`,
        totalEngagement: analysisContent.engagement,
        whyItHit: [
          `Strong engagement rate of ${analysisContent.analytics.engagementRate}%`,
          `Impressive view count of ${analysisContent.analytics.views.toLocaleString()}`,
          `Active community with ${analysisContent.analytics.comments} comments`,
          `Content type "${analysisContent.type}" resonated well`,
          "Posted during optimal timing windows",
        ],
        keyElements: {
          caption: `${
            analysisContent.title
          } - High performing ${analysisContent.type.toLowerCase()} content`,
          hashtags: ["#HighPerformance", "#Engagement", "#SocialMedia"],
          timing: `Posted on ${analysisContent.date}`,
          contentType: analysisContent.type,
        },
        performanceMetrics: {
          likes: analysisContent.analytics.likes.toLocaleString(),
          comments: analysisContent.analytics.comments.toString(),
          shares: analysisContent.analytics.shares.toString(),
          saves: Math.round(analysisContent.analytics.likes * 0.1).toString(),
        },
      };
      setAnalysisData(convertedData);
    } else {
      setUrl("");
      setAnalysisData(null);
    }
  }, [analysisContent]);

  const handleAnalyze = async () => {
    if (!url) return;

    setIsAnalyzing(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock analysis data
      setAnalysisData({
        title: "10 Marketing Tips That Changed My Business Forever",
        platform: "LinkedIn",
        hitScore: 92,
        peakTime: "March 15, 2024 at 2:30 PM EST",
        totalEngagement: "15.2K",
        whyItHit: [
          "Strong emotional hook in the title",
          "Listed format appeals to quick consumption",
          "Personal story creates authenticity",
          "Posted during peak business hours",
          "Used trending business hashtags",
        ],
        keyElements: {
          caption:
            "The moment I implemented these 10 strategies, everything changed. Here's what I wish I knew 5 years ago... 🧵",
          hashtags: [
            "#MarketingTips",
            "#BusinessGrowth",
            "#Entrepreneur",
            "#LinkedIn",
            "#Success",
          ],
          timing: "Posted on Tuesday at 2:30 PM EST",
          contentType: "Carousel post with 10 slides",
        },
        performanceMetrics: {
          likes: "8,940",
          comments: "1,203",
          shares: "2,847",
          saves: "2,210",
        },
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setUrl("");
  };

  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      setAnalysisData(null);
      setUrl(""); // Clear the input field
    };
  }, []);

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Content Analysis
        </h1>
        <p className="text-gray-600">
          Analyze any viral content to understand what made it successful.
        </p>
      </div>

      {/* URL Input Section */}
      <div className="mb-6">
        <div
          className="p-6 max-w-4xl"
          style={{
            borderRadius: "36px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📊 Submit Content for Analysis
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your content URL here (LinkedIn, Twitter, Instagram, etc.)"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500"
              disabled={isAnalyzing}
            />
            <button
              onClick={analysisData ? resetAnalysis : handleAnalyze}
              disabled={isAnalyzing || (!url && !analysisData)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                analysisData
                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                  : isAnalyzing
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${
                !url && !analysisData ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAnalyzing
                ? "Analyzing..."
                : analysisData
                ? "New Analysis"
                : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Analyzing your content...</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysisData && !isAnalyzing && (
        <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl">
          {/* Content Overview */}
          <div
            className="p-6"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              🎯 Content Overview
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Content Title</p>
                <p className="font-semibold text-gray-800">
                  {analysisData.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Platform</p>
                <p className="font-semibold text-blue-600">
                  {analysisData.platform}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Hit Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {analysisData.hitScore}/100
                </p>
              </div>
            </div>
          </div>

          {/* First Row */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Why It Hit */}
            <div
              className="p-6 flex-1"
              style={{
                borderRadius: "36px",
                background: "#ffffff",
                border: "2px solid #e0e0e0",
                boxSizing: "border-box",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                🚀 Why It Hit
              </h3>
              <div className="space-y-3">
                {analysisData?.whyItHit?.map(
                  (reason: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-700">{reason}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* When It Hit */}
            <div
              className="p-6 lg:w-80"
              style={{
                borderRadius: "36px",
                background: "#ffffff",
                border: "2px solid #e0e0e0",
                boxSizing: "border-box",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                ⏰ When It Hit
              </h3>
              <div className="text-center">
                <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-gray-600">Peak Performance</p>
                  <p className="text-lg font-bold text-blue-600">
                    {analysisData.peakTime}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Engagement
                    </span>
                    <span className="font-semibold text-gray-800">
                      {analysisData.totalEngagement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Performance Metrics */}
            <div
              className="p-6 lg:w-80"
              style={{
                borderRadius: "36px",
                background: "#ffffff",
                border: "2px solid #e0e0e0",
                boxSizing: "border-box",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📈 Performance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="text-lg font-bold text-red-600">
                    {analysisData.performanceMetrics.likes}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-lg font-bold text-blue-600">
                    {analysisData.performanceMetrics.comments}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Shares</p>
                  <p className="text-lg font-bold text-green-600">
                    {analysisData.performanceMetrics.shares}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Saves</p>
                  <p className="text-lg font-bold text-purple-600">
                    {analysisData.performanceMetrics.saves}
                  </p>
                </div>
              </div>
            </div>

            {/* How It Hit - Key Elements */}
            <div
              className="p-6 flex-1"
              style={{
                borderRadius: "36px",
                background: "#ffffff",
                border: "2px solid #e0e0e0",
                boxSizing: "border-box",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                ✨ How It Hit - Key Elements
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Caption
                  </p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-2xl">
                    {analysisData.keyElements.caption}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Hashtags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisData?.keyElements?.hashtags?.map(
                      (tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Timing</p>
                    <p className="text-gray-800">
                      {analysisData.keyElements.timing}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Content Type
                    </p>
                    <p className="text-gray-800">
                      {analysisData.keyElements.contentType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
