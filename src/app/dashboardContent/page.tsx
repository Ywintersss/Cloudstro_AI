"use client";
import React, { useState, useEffect } from "react";
import DemoSetup from "../../components/dashboard/demo-setup";

interface DashboardAnalytics {
  totalPosts: number;
  engagementRate: number;
  topHashtags: string[];
  bestPostingTime: string;
  bestPostingDay: string;
  averageEngagement: number;
  totalReach: number;
  regionStats: Array<{ region: string; percentage: number }>;
  platformStats: Array<{ platform: string; posts: number; engagement: number }>;
  recentActivity: Array<{ date: string; posts: number; engagement: number }>;
}

export default function DashboardContent() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/analytics?timeRange=30', {
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
        setIsDemoData(data.isDemoData || false);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const createDemoUserAndLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create demo user
      const signupResponse = await fetch('/api/dynamodb/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `demo_${Date.now()}@cloudstro.com`,
          username: `demo_user_${Date.now()}`,
          fullName: 'Demo User',
          password: 'demo123456',
          subscription: 'pro'
        })
      });

      if (!signupResponse.ok) {
        throw new Error('Failed to create demo user');
      }

      const userData = await signupResponse.json();
      
      // Login with demo user
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: userData.data.email,
          password: 'demo123456'
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Failed to login demo user');
      }

      const loginData = await loginResponse.json();
      
      // Store user data in localStorage for demo setup component
      localStorage.setItem('user', JSON.stringify(loginData.user));
      
      // Refresh analytics after successful login
      await fetchDashboardAnalytics();
      
    } catch (err) {
      console.error('Error creating demo user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create demo user');
    } finally {
      setLoading(false);
    }
  };

  const onDemoDataCreated = () => {
    // Refresh analytics when demo data is created
    fetchDashboardAnalytics();
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <DemoSetup onDemoDataCreated={onDemoDataCreated} />
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <DemoSetup onDemoDataCreated={onDemoDataCreated} />
        </div>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">Failed to load dashboard analytics</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={createDemoUserAndLogin}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium mr-4"
              >
                🚀 Create Demo User & Login
              </button>
              <button 
                onClick={fetchDashboardAnalytics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      {/* Demo Data Indicator */}
      {isDemoData && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            📊 <strong>Demo Mode:</strong> You're viewing sample analytics data. 
            <button 
              onClick={createDemoUserAndLogin}
              className="ml-2 text-blue-600 hover:text-blue-700 underline"
            >
              Create account to see your real data
            </button>
          </p>
        </div>
      )}

      {/* Demo Setup for Hackathon */}
      <div className="mb-8">
        <DemoSetup onDemoDataCreated={onDemoDataCreated} />
      </div>

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
                <p className="text-2xl font-bold text-gray-800">{analytics?.totalPosts || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics?.engagementRate ? `${analytics.engagementRate}%` : '0%'}
                </p>
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
                {analytics?.topHashtags?.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${
                      index === 0 ? 'bg-blue-100 text-blue-800' :
                      index === 1 ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {tag}
                  </span>
                )) || [
                  <span key="0" className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">#marketing</span>,
                  <span key="1" className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">#growth</span>,
                  <span key="2" className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">#engagement</span>
                ]}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {analytics?.topHashtags?.length || 0} active tags
              </p>
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
              {analytics?.regionStats?.slice(0, 3).map((region, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm text-gray-600">{region.region}</span>
                  <span className="text-sm font-medium">{region.percentage}%</span>
                </div>
              )) || [
                <div key="0" className="flex justify-between">
                  <span className="text-sm text-gray-600">United States</span>
                  <span className="text-sm font-medium">45%</span>
                </div>,
                <div key="1" className="flex justify-between">
                  <span className="text-sm text-gray-600">Canada</span>
                  <span className="text-sm font-medium">23%</span>
                </div>,
                <div key="2" className="flex justify-between">
                  <span className="text-sm text-gray-600">UK</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
              ]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}