"use client";
import React from "react";

export default function SettingsContent() {
  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl">
        {/* Account Settings */}
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
              👤 Account Settings
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue="socialheat_user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Account Settings
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
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
                🔔 Notifications
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                  <p className="text-xs text-gray-500">Browser push notifications</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Weekly Reports</p>
                  <p className="text-xs text-gray-500">Performance summary emails</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Marketing Updates</p>
                  <p className="text-xs text-gray-500">Product news and tips</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
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
                🔐 Privacy & Security
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Profile Visibility</p>
                  <p className="text-xs text-gray-500">Who can see your profile</p>
                </div>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Data Analytics</p>
                  <p className="text-xs text-gray-500">Allow usage tracking</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className="p-4 lg:p-6"
          style={{
            borderRadius: "36px",
            background: "#ffffff",
            border: "2px solid #fee2e2",
            boxSizing: "border-box",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-red-700">
              ⚠️ Danger Zone
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Export Data</h4>
                <p className="text-sm text-gray-600">Download a copy of all your data</p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Export Data
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Delete Account</h4>
                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}