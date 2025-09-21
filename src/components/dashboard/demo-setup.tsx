"use client";
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface DemoSetupProps {
  onDemoDataCreated?: () => void;
}

export default function DemoSetup({ onDemoDataCreated }: DemoSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [demoData, setDemoData] = useState<any>(null);
  const [accountsCreated, setAccountsCreated] = useState(false);

  const createMockAccounts = async () => {
    setIsLoading(true);
    try {
      // Get current user from localStorage or context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.userId) {
        alert('Please log in first to create demo accounts');
        return;
      }

      const response = await fetch('/api/social-media/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setAccountsCreated(true);
        alert(`Successfully created ${result.count} demo social media accounts!`);
        onDemoDataCreated?.();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating mock accounts:', error);
      alert('Failed to create demo accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/social-media/demo?platform=twitter&count=15');
      const result = await response.json();
      
      if (response.ok) {
        setDemoData(result.data);
        alert('Demo data generated successfully! Check the dashboard for sample posts and analytics.');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error generating demo data:', error);
      alert('Failed to generate demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMultiPlatformData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/social-media/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: ['twitter', 'facebook', 'youtube', 'tiktok']
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setDemoData(result.data);
        alert('Multi-platform demo data generated! Your dashboard now shows sample data from all platforms.');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error generating multi-platform data:', error);
      alert('Failed to generate multi-platform data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          🚀 Hackathon Demo Mode
        </h3>
        <p className="text-gray-600 mb-6">
          No social media credentials? No problem! Generate realistic demo data to showcase your AI-powered social media platform.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={createMockAccounts}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Creating...' : '1. Create Demo Accounts'}
            </Button>
            
            <Button
              onClick={generateDemoData}
              disabled={isLoading}
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              {isLoading ? 'Generating...' : '2. Generate Sample Posts'}
            </Button>
            
            <Button
              onClick={generateMultiPlatformData}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? 'Loading...' : '3. Full Demo Data'}
            </Button>
          </div>
          
          {accountsCreated && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Demo accounts created! You can now connect to Twitter, Facebook, YouTube, and TikTok (all using mock data).
              </p>
            </div>
          )}
          
          {demoData && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <p className="text-blue-800 text-sm">
                📊 Demo data ready! Check your dashboard for sample posts, analytics, and AI insights.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>
            💡 Demo mode is active. All data is simulated for presentation purposes.
            <br />
            Platforms: Twitter • Facebook • YouTube • TikTok
          </p>
        </div>
      </div>
    </Card>
  );
}