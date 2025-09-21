import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3, 
  Lightbulb,
  RefreshCw,
  Clock
} from 'lucide-react';

interface AIInsight {
  insightId: string;
  type: string;
  platform?: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  generatedAt: string;
  isActive: boolean;
}

interface AIMetrics {
  totalInsights: number;
  activeInsights: number;
  averageConfidence: number;
  insightTypes: Record<string, number>;
  platformDistribution: Record<string, number>;
}

export function AIInsightsDashboard({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const fetchInsights = async (type?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ 
        userId,
        limit: '20'
      });
      
      if (type && type !== 'all') {
        params.append('type', type);
      }

      const response = await fetch(`/api/social-media/insights?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
    setIsLoading(false);
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/social-media/insights/metrics?userId=${userId}&days=30`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data.overview);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const runAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/social-media/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, timeRange: 30 })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh insights after analytics run
        await fetchInsights(selectedType);
        await fetchMetrics();
      }
    } catch (error) {
      console.error('Error running analytics:', error);
    }
    setIsLoading(false);
  };

  const markInsightAsUsed = async (insightId: string) => {
    try {
      const response = await fetch('/api/social-media/insights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, insightId })
      });
      
      if (response.ok) {
        // Refresh insights
        await fetchInsights(selectedType);
      }
    } catch (error) {
      console.error('Error marking insight as used:', error);
    }
  };

  useEffect(() => {
    fetchInsights(selectedType);
    fetchMetrics();
  }, [userId, selectedType]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimal_timing': return <Clock className="h-4 w-4" />;
      case 'content_strategy': return <Target className="h-4 w-4" />;
      case 'cross_platform_strategy': return <BarChart3 className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Insights Dashboard
          </h2>
          <p className="text-muted-foreground">
            AI-powered recommendations for your social media strategy
          </p>
        </div>
        <Button onClick={runAnalytics} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Generate New Insights
        </Button>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Insights</p>
                  <p className="text-2xl font-bold">{metrics.totalInsights}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Insights</p>
                  <p className="text-2xl font-bold">{metrics.activeInsights}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">{Math.round(metrics.averageConfidence * 100)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platforms</p>
                  <p className="text-2xl font-bold">{Object.keys(metrics.platformDistribution).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'optimal_timing', 'content_strategy', 'cross_platform_strategy'].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type)}
          >
            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        ))}
      </div>

      {/* Insights List */}
      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card key={insight.insightId} className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <CardTitle className="text-lg">
                    {insight.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                  {insight.platform && (
                    <Badge variant="secondary">{insight.platform}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getConfidenceColor(insight.confidence)}>
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                  {insight.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markInsightAsUsed(insight.insightId)}
                    >
                      Mark as Used
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription>
                Generated {new Date(insight.generatedAt).toLocaleDateString()} at{' '}
                {new Date(insight.generatedAt).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Recommendation
                  </h4>
                  <p className="text-sm">{insight.recommendation}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    AI Reasoning
                  </h4>
                  <p className="text-sm text-muted-foreground">{insight.reasoning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {insights.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No insights available</h3>
              <p className="text-muted-foreground mb-4">
                Run analytics to generate AI-powered insights for your social media strategy.
              </p>
              <Button onClick={runAnalytics}>
                Generate Insights
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Generating AI insights...</span>
        </div>
      )}
    </div>
  );
}