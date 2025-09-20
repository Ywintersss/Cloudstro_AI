"use client";
import React from "react";

export default function PersonalizationsContent() {
  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Personalizations
        </h1>
        <p className="text-gray-600">
          Customize your social media presence with personalized settings and
          preferences.
        </p>
      </div>

      {/* Personalizations Grid */}
      <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl">
        {/* Profile Customization */}
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
            <h3 className="text-lg font-bold text-gray-800">
              👤 Profile Customization
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Voice
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Authoritative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Theme
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Technology</option>
                  <option>Lifestyle</option>
                  <option>Business</option>
                  <option>Creative</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g., Young professionals, 25-35"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Colors
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    defaultValue="#3B82F6"
                    className="w-12 h-10 rounded border"
                  />
                  <input
                    type="color"
                    defaultValue="#10B981"
                    className="w-12 h-10 rounded border"
                  />
                  <input
                    type="color"
                    defaultValue="#F59E0B"
                    className="w-12 h-10 rounded border"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Description
                </label>
                <textarea
                  placeholder="Describe your content ideas, topics, or themes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Personalization */}
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
            <h3 className="text-lg font-bold text-gray-800">
              🎬 Platform Personalization
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thumbnail Customization */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Thumbnail Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Thumbnail Style
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Bold & Colorful</option>
                    <option>Minimalist</option>
                    <option>Professional</option>
                    <option>Creative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Placement
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Bottom Right</option>
                    <option>Bottom Left</option>
                    <option>Top Right</option>
                    <option>Top Left</option>
                    <option>Center</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700">Auto-generate thumbnails</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Include trending elements</span>
                </div>
              </div>
            </div>

            {/* Caption Customization */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Caption Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption Length
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Short (50-100 characters)</option>
                    <option>Medium (100-200 characters)</option>
                    <option>Long (200+ characters)</option>
                    <option>Auto-optimize</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hashtag Strategy
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Trending hashtags</option>
                    <option>Niche-specific</option>
                    <option>Brand hashtags only</option>
                    <option>Mixed approach</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700">Include call-to-action</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-700">Add emoji suggestions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Preferences Row */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          {/* Content Preferences Card */}
          <div
            className="p-4 lg:p-6 flex-1"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                📝 Content Preferences
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  Auto-generate hashtags
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  Suggest posting times
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">
                  Include trending topics
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">
                  Content tone analysis
                </span>
              </div>
            </div>
          </div>

          {/* AI Personalization Card */}
          <div
            className="p-4 lg:p-6 md:w-[400px]"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                🤖 AI Personalization
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Learning Progress</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "87%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                AI is learning your preferences based on your content history
                and engagement patterns.
              </p>
              <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200">
                View AI Insights
              </button>
            </div>
          </div>
        </div>

        {/* Generate Thumbnail Section */}
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
            <h3 className="text-lg font-bold text-gray-800">
              🖼️ Generate Thumbnail
            </h3>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Create custom thumbnails based on your personalization settings
            </p>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
              Generate Thumbnail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}