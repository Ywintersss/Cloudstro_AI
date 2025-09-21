"use client";
import React from "react";

export default function DashboardContent() {
  return (
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
      <div className="flex flex-col gap-4 lg:gap-6">
      
        {/* Second Row */}
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Statistics Card */}
          <div
            className="p-4 lg:p-6 w-full"
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
            className="p-4 lg:p-6 flex-1 w-full"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">🏷️ Trending Tags</h3>
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

          {/* Region for Best Traffic Card */}
          <div
            className="p-4 lg:p-6 w-full"
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
  );
}