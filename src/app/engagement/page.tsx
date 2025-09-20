"use client";
import { useState } from "react";

export default function EngagementContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");

  const sampleComments = [
    { id: 1, user: "john_doe", comment: "Great content! Really helpful.", platform: "Instagram", time: "2 hours ago", type: "positive" },
    { id: 2, user: "sarah_smith", comment: "Can you share more details about this?", platform: "Twitter", time: "4 hours ago", type: "question" },
    { id: 3, user: "mike_wilson", comment: "This is amazing work!", platform: "LinkedIn", time: "6 hours ago", type: "positive" },
    { id: 4, user: "emma_brown", comment: "Not sure I agree with this approach", platform: "Facebook", time: "8 hours ago", type: "negative" },
    { id: 5, user: "david_lee", comment: "Could you elaborate on the second point?", platform: "Instagram", time: "1 day ago", type: "question" }
  ];

  const handleCommentSelect = (commentId: number) => {
    setSelectedComments(prev => {
      if (prev.includes(commentId)) {
        return prev.filter(id => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  };

  const filteredComments = sampleComments.filter(comment => {
    if (filterType === "all") return true;
    return comment.type === filterType;
  });

  const handleBulkReply = () => {
    if (selectedComments.length > 0 && replyText.trim()) {
      alert(`Reply sent to ${selectedComments.length} comment(s): "${replyText}"`);
      setSelectedComments([]);
      setReplyText("");
    }
  };

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Engagement Analytics
        </h1>
        <p className="text-gray-600">
          Track and analyze your audience engagement across all platforms.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2 mb-6">
        {[
          { value: "24h", label: "24 Hours" },
          { value: "7days", label: "7 Days" },
          { value: "30days", label: "30 Days" },
          { value: "90days", label: "90 Days" }
        ].map((timeframe) => (
          <button
            key={timeframe.value}
            onClick={() => setSelectedTimeframe(timeframe.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTimeframe === timeframe.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>

      {/* Engagement Grid */}
      <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl">
        {/* Engagement Overview */}
        <div
          className="p-4 lg:p-6"
          style={{
            borderRadius: "36px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
            height: "200px",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              📈 Engagement Overview
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-red-500">2,847</p>
              <p className="text-xs text-green-600">+12.3% from last period</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Comments</p>
              <p className="text-2xl font-bold text-blue-500">456</p>
              <p className="text-xs text-green-600">+8.7% from last period</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Shares</p>
              <p className="text-2xl font-bold text-green-500">234</p>
              <p className="text-xs text-green-600">+15.2% from last period</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-purple-500">7.8%</p>
              <p className="text-xs text-green-600">+2.1% from last period</p>
            </div>
          </div>
        </div>

        {/* Audience Engagement Section */}
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
              💬 Audience Engagement Management
            </h3>
          </div>
          
          {/* Filter and Reply Controls */}
          <div className="mb-4 space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Comments</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="question">Questions</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {selectedComments.length} comment(s) selected
              </div>
            </div>
            
            {selectedComments.length > 0 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleBulkReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Reply to Selected
                </button>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedComments.includes(comment.id)
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleCommentSelect(comment.id)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-gray-800">@{comment.user}</span>
                        <span className="px-2 py-1 bg-gray-200 text-xs rounded">{comment.platform}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          comment.type === 'positive' ? 'bg-green-100 text-green-800' :
                          comment.type === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Details Row */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          {/* Top Posts Card */}
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
                🏆 Top Performing Posts
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { title: "Product launch announcement", engagement: "847 interactions", time: "2 hours ago" },
                { title: "Behind the scenes video", engagement: "623 interactions", time: "1 day ago" },
                { title: "Customer testimonial", engagement: "456 interactions", time: "3 days ago" },
                { title: "Industry insights thread", engagement: "389 interactions", time: "5 days ago" }
              ].map((post, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                  <span className="text-xs font-medium text-blue-600">{post.engagement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Breakdown Card */}
          <div
            className="p-4 lg:p-6 md:w-[350px]"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                🌐 Platform Breakdown
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { platform: "Instagram", engagement: "45%", color: "bg-pink-500" },
                { platform: "Twitter", engagement: "28%", color: "bg-blue-400" },
                { platform: "LinkedIn", engagement: "18%", color: "bg-blue-600" },
                { platform: "Facebook", engagement: "9%", color: "bg-blue-700" }
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{item.platform}</span>
                    <span className="text-sm font-medium">{item.engagement}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: item.engagement }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audience Insights Row */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          {/* Audience Activity Card */}
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
                ⏰ Peak Activity Times
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Morning</p>
                <p className="text-lg font-bold text-orange-600">8-10 AM</p>
                <p className="text-xs text-gray-500">23% engagement</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Afternoon</p>
                <p className="text-lg font-bold text-green-600">2-4 PM</p>
                <p className="text-xs text-gray-500">45% engagement</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Evening</p>
                <p className="text-lg font-bold text-purple-600">7-9 PM</p>
                <p className="text-xs text-gray-500">32% engagement</p>
              </div>
            </div>
          </div>

          {/* Content Types Card */}
          <div
            className="p-4 lg:p-6 md:w-[350px]"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                📊 Content Performance
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { type: "Videos", performance: "High", color: "text-green-600" },
                { type: "Images", performance: "Medium", color: "text-yellow-600" },
                { type: "Text Posts", performance: "Medium", color: "text-yellow-600" },
                { type: "Polls", performance: "High", color: "text-green-600" },
                { type: "Stories", performance: "Low", color: "text-red-600" }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{item.type}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.performance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}