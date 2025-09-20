import React from "react";
import Sidebar from "../../components/dashboard/sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar activeItem="dashboard" />

      {/* Main Content Container */}
      <main className="lg:ml-64 min-h-screen">
        {/* Dashboard Content */}
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your social media today.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl">
            {/* First Row - AI Prompt Section */}
            <div
              className="p-4 lg:p-6"
              style={{
                borderRadius: "36px",
                background: "#ffffff",
                border: "2px solid #e0e0e0",
                boxSizing: "border-box",
                height: "250px",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  🤖 AI Content Generator
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                The AI Prompt Section allows you to generate content suggestions
                and integrate them into your statistics dashboard.
              </p>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter your content prompt..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                />
                <button className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                  Generate
                </button>
              </div>
            </div>
            {/* Second Row */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
              {/* Statistics Card */}
              <div
                className="p-4 lg:p-6 h-48 md:w-[250px] lg:w-[250px]"
                style={{
                  borderRadius: "36px",
                  background: "#ffffff",
                  border: "2px solid #e0e0e0",
                  boxSizing: "border-box",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    📊 Statistics
                  </h3>
                </div>
                <div className="space-y-3 flex flex-row justify-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-800">1,247</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold text-green-600">+12.5%</p>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              <div
                className="p-4 lg:p-6 h-48 flex-1 md:w-[450px] lg:w-[450px]"
                style={{
                  borderRadius: "36px",
                  background: "#ffffff",
                  border: "2px solid #e0e0e0",
                  boxSizing: "border-box",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">🏷️ Tags</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      #marketing
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      #growth
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      #engagement
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">25 active tags</p>
                </div>
              </div>
            </div>
            {/* Third Row */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
              {/* Recommendation Time Card */}
              <div
                className="p-4 lg:p-6 h-48 flex-1 md:w-[450px] lg:w-[450px]"
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
                    <p className="text-lg font-bold text-blue-600">2:00 PM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Peak Day</p>
                    <p className="text-lg font-bold text-green-600">Tuesday</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Engagement</p>
                    <p className="text-lg font-bold text-purple-600">8.7%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Reach</p>
                    <p className="text-lg font-bold text-orange-600">12.3K</p>
                  </div>
                </div>
              </div>

              {/* Region for Best Traffic Card */}
              <div
                className="p-4 lg:p-6 h-48 md:w-[350px] lg:w-[350px]"
                style={{
                  borderRadius: "36px",
                  background: "#ffffff",
                  border: "2px solid #e0e0e0",
                  boxSizing: "border-box",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    🌍 Region for Best Traffic
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">United States</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Canada</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">UK</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
