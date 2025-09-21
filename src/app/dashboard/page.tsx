"use client";
import { useState } from "react";
import Sidebar from "../../components/dashboard/sidebar";
import DashboardContent from "../dashboardContent/page";
import PersonalizationsContent from "../contentPersonalization/page";
import EngagementContent from "../engagement/page";
import SettingsContent from "../settings/page";
import ContentAnalysisPage from "../contentAnalysis/page";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [analysisContent, setAnalysisContent] = useState(null);

  const handleNavigation = (page: string) => {
    // Clear analysis content when navigating away from analysis page
    if (page !== "analysis") {
      setAnalysisContent(null);
    }
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "personalizations":
        return <PersonalizationsContent />;
      case "engagement":
        return (
          <EngagementContent
            onNavigate={handleNavigation}
            onSetAnalysisContent={setAnalysisContent}
          />
        );
      case "settings":
        return <SettingsContent />;
      case "analysis":
        return <ContentAnalysisPage analysisContent={analysisContent} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem={activePage} onNavigate={handleNavigation} />
      <main className="lg:ml-64 min-h-screen">{renderContent()}</main>
    </div>
  );
}
