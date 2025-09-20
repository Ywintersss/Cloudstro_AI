"use client";
import Image from "next/image";
import { useState } from "react";

interface SidebarProps {
  activeItem?: string;
  onNavigate: (page: string) => void; // Add navigation handler prop
}

export default function Sidebar({
  activeItem = "dashboard",
  onNavigate,
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="cursor-pointer lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border-2 border-gray-300 shadow-md hover:border-gray-400 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="text-xl text-gray-700">☰</span>
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="ease-in lg:hidden fixed inset-0 bg-opacity-70 backdrop-blur-md z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 p-6 fixed left-0 top-0 h-full overflow-y-auto flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        style={{
          background: "#f9f9f9",
          boxShadow: "2px 2px 0px #5a5a5a, -2px -2px 0px #ffffff",
        }}
      >
        {/* Close button for mobile */}
        <button
          className="cursor-pointer lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="mb-8 flex items-center space-x-3">
          <Image src="/logo.svg" alt="CloudStro Logo" width={40} height={40} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">CloudStro</h2>
            <p className="text-sm text-gray-600">Social Media Booster</p>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <button
            onClick={() => handleNavigation("dashboard")}
            className={`cursor-pointer w-full flex items-center px-4 py-3 rounded-lg transition-all text-left ${
              activeItem === "dashboard"
                ? "text-gray-700 font-medium"
                : "text-gray-600 hover:text-gray-800 hover:shadow-sm"
            }`}
            style={
              activeItem === "dashboard"
                ? {
                    background: "#ffffff",
                    border: "2px solid #e0e0e0",
                  }
                : {}
            }
          >
            <span className="text-lg">📊</span>
            <span className="ml-3">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("personalizations")}
            className={`cursor-pointer w-full flex items-center px-4 py-3 rounded-lg transition-all text-left ${
              activeItem === "personalizations"
                ? "text-gray-700 font-medium"
                : "text-gray-600 hover:text-gray-800 hover:shadow-sm"
            }`}
            style={
              activeItem === "personalizations"
                ? {
                    background: "#ffffff",
                    border: "2px solid #e0e0e0",
                  }
                : {}
            }
          >
            <span className="text-lg">🎨</span>
            <span className="ml-3">Personalizations</span>
          </button>

          <button
            onClick={() => handleNavigation("engagement")}
            className={`cursor-pointer w-full flex items-center px-4 py-3 rounded-lg transition-all text-left ${
              activeItem === "engagement"
                ? "text-gray-700 font-medium"
                : "text-gray-600 hover:text-gray-800 hover:shadow-sm"
            }`}
            style={
              activeItem === "engagement"
                ? {
                    background: "#ffffff",
                    border: "2px solid #e0e0e0",
                  }
                : {}
            }
          >
            <span className="text-lg">💬</span>
            <span className="ml-3">Engagement</span>
          </button>

          <button
            onClick={() => handleNavigation("analysis")}
            className={`cursor-pointer w-full flex items-center px-4 py-3 rounded-lg transition-all text-left ${
              activeItem === "analysis"
                ? "text-gray-700 font-medium"
                : "text-gray-600 hover:text-gray-800 hover:shadow-sm"
            }`}
            style={
              activeItem === "analysis"
                ? {
                    background: "#ffffff",
                    border: "2px solid #e0e0e0",
                  }
                : {}
            }
          >
            <span className="text-lg">👤</span>
            <span className="ml-3">Content Analysis</span>
          </button>
        </nav>

        <div className="mt-6 flex flex-col space-y-4">
          <button
            onClick={() => handleNavigation("settings")}
            className={`cursor-pointer w-full flex items-center px-4 py-3 rounded-lg transition-all text-left ${
              activeItem === "settings"
                ? "text-gray-700 font-medium"
                : "text-gray-600 hover:text-gray-800 hover:shadow-sm"
            }`}
            style={
              activeItem === "settings"
                ? {
                    background: "#ffffff",
                    border: "2px solid #e0e0e0",
                  }
                : {}
            }
          >
            <span className="text-lg">⚙️</span>
            <span className="ml-3">Settings</span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              // Add logout logic here
              window.location.href = "/";
            }}
            className="cursor-pointer w-full px-4 py-3 text-white rounded-lg transition-all hover:scale-105"
            style={{
              background: "#ef4444",
              boxShadow: "3px 3px 0px #dc2626, -2px -2px 0px #f87171",
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
