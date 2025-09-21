"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BarChart3 } from "lucide-react";
import Image from "next/image";

interface Message {
  id: number;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ContentAnalysisPage({
  analysisContent,
}: {
  analysisContent: any;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your AI content analyst. I can help you understand what makes content go viral and provide detailed insights about your posts. You can either paste a URL or upload content for analysis.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle analysis content from other pages
  useEffect(() => {
    if (analysisContent && analysisContent.analytics) {
      // Prevent duplicate analysis for the same content
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) =>
            m.type === "user" &&
            m.content.includes(
              `Analyze this content: "${analysisContent.title}"`
            )
        );
        if (alreadyExists) return prev;
        const baseId = Date.now();
        const analysisMessage: Message = {
          id: baseId,
          type: "user",
          content: `Analyze this content: "${analysisContent.title}" from ${analysisContent.date}`,
          timestamp: new Date(),
        };
        const responseMessage: Message = {
          id: baseId + 1000,
          type: "assistant",
          content: generateDetailedAnalysis(analysisContent),
          timestamp: new Date(),
        };
        return [...prev, analysisMessage, responseMessage];
      });
    }
  }, [analysisContent]);

  const generateDetailedAnalysis = (content: any) => {
    const { analytics } = content;

    return `# Content Analysis: "${content.title}"

## Performance Overview
This ${content.type.toLowerCase()} content achieved exceptional results with a **${
      analytics.engagementRate
    }% engagement rate**, significantly above industry standards. Here's my detailed breakdown:

## Key Performance Metrics
- **Views**: ${analytics.views.toLocaleString()} impressions
- **Engagement**: ${analytics.likes.toLocaleString()} likes, ${
      analytics.comments
    } comments, ${analytics.shares} shares
- **Reach**: ${analytics.impressions.toLocaleString()} total impressions
- **Performance Score**: ${Math.round(analytics.engagementRate * 10)}/100

## Why This Content Succeeded

### 1. Strong Engagement Fundamentals
The ${
      analytics.engagementRate
    }% engagement rate indicates your audience found genuine value in this content. This is particularly impressive given the ${analytics.views.toLocaleString()} view count, suggesting strong content-audience fit.

### 2. Community Response
With ${
      analytics.comments
    } comments, this content sparked meaningful conversation. High comment rates typically indicate:
- Controversial or thought-provoking elements
- Clear call-to-action prompts
- Topics that resonate with audience pain points

### 3. Shareability Factor
${
  analytics.shares
} shares demonstrate the content's viral potential. Content gets shared when it:
- Provides clear value to the sharer's network
- Aligns with personal or professional brand
- Contains quotable or memorable elements

## Content Strategy Insights

### Optimal Timing
Posted on ${
      content.date
    }, this content likely benefited from strategic timing. The engagement pattern suggests it caught your audience during high-activity periods.

### Content Format Impact
The "${
      content.type
    }" format worked exceptionally well for your audience. This format typically performs well because it:
- Breaks complex information into digestible pieces
- Maintains visual interest throughout
- Encourages sequential engagement

## Recommendations for Future Content

### 1. Replicate Success Elements
- **Content Structure**: The format that drove ${
      analytics.engagementRate
    }% engagement should be a template for future posts
- **Topic Authority**: This subject matter clearly resonates with your audience
- **Engagement Hooks**: Whatever prompted ${
      analytics.comments
    } comments should be incorporated into future content

### 2. Scale the Approach
- Create a series building on this topic
- Develop related content that addresses follow-up questions from comments
- Consider expanding into different content formats while maintaining the core message

### 3. Optimize Distribution
- Analyze the ${analytics.impressions.toLocaleString()} impressions to understand your reach patterns
- Study when your ${analytics.likes.toLocaleString()} likes were generated to optimize future posting times
- Consider paid promotion for similar high-performing content

## Competitive Analysis Context
Based on industry benchmarks, your content performance indicates:
- **Engagement Rate**: Top 10% of content in your niche
- **Comment Rate**: Exceptionally high community interaction
- **Share Rate**: Strong viral potential demonstrated

This analysis suggests you've identified a winning content formula. The key is systematically replicating these elements while testing incremental variations to optimize further.

Would you like me to dive deeper into any specific aspect of this analysis or help you plan content that builds on these successful elements?`;
  };

  const generateAnalysisFromUrl = (url: string) => {
    // Mock analysis for URL input
    return `# Content Analysis Results

I've analyzed the content from your URL and here's what I found:

## Performance Assessment
Based on the URL analysis, this appears to be a high-performing piece of content. Here's my detailed breakdown:

## Content Success Factors

### 1. Title Optimization
The headline demonstrates strong psychological triggers:
- Creates curiosity gaps that compel clicks
- Uses power words that generate emotional response
- Structured for optimal social media sharing

### 2. Engagement Architecture
The content structure shows several viral elements:
- **Hook Strength**: Opens with attention-grabbing statement
- **Value Delivery**: Provides actionable insights throughout
- **Social Proof**: Incorporates credibility markers
- **Call-to-Action**: Clear next steps for audience

### 3. Platform Optimization
Content appears optimized for cross-platform performance:
- **Visual Elements**: Uses compelling imagery/graphics
- **Length**: Optimal for platform algorithm preferences
- **Formatting**: Easy to scan and consume
- **Hashtag Strategy**: Leverages trending and niche-specific tags

## Viral Mechanics Analysis

### Why This Content Spreads
1. **Relatability**: Addresses common pain points in your niche
2. **Timing**: Published during optimal engagement windows
3. **Format**: Uses proven high-engagement content structures
4. **Community**: Taps into existing conversations and trends

### Growth Amplifiers
- **Network Effects**: Content encourages sharing to specific groups
- **Authority Building**: Positions creator as thought leader
- **Value Density**: High insight-to-length ratio
- **Conversation Starter**: Generates comments and discussions

## Replication Strategy

### Core Elements to Maintain
1. **Content Angle**: The unique perspective that differentiates this from competitors
2. **Structure Format**: The organizational pattern that maintains engagement
3. **Voice/Tone**: The communication style that resonates with your audience
4. **Value Proposition**: The specific benefit delivered to readers

### Optimization Opportunities
- **Expand into Series**: This topic could support multiple related posts
- **Cross-Platform Adaptation**: Tailor versions for different social platforms
- **Interactive Elements**: Add polls, questions, or challenges
- **Visual Enhancement**: Incorporate more engaging graphics or video

## Performance Predictions
Based on this analysis, similar content should achieve:
- **Engagement Rate**: 8-12% (above industry average)
- **Share Rate**: High viral potential in your niche
- **Comment Generation**: Strong discussion catalyst
- **Audience Growth**: Significant follower acquisition potential

Would you like me to help you create a content calendar based on these successful elements, or analyze specific aspects in more detail?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAnalyzing) return;

    const baseId = Date.now();
    const userMessage: Message = {
      id: baseId,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsAnalyzing(true);

    // Simulate AI processing
    setTimeout(() => {
      const isUrl = inputValue.includes("http") || inputValue.includes("www.");
      const responseContent = isUrl
        ? generateAnalysisFromUrl(inputValue)
        : `I understand you want to analyze: "${inputValue}". 

For the most accurate analysis, I'd need more specific information. You can:

1. **Paste a direct URL** to the content you want analyzed
2. **Describe the content type and performance metrics** (likes, shares, comments, views)
3. **Upload or describe the content details** including platform, posting date, and engagement data

If you have specific questions about content strategy, viral mechanics, or performance optimization, I'm here to help with detailed insights and actionable recommendations.

What would you like to focus on?`;

      const responseMessage: Message = {
        id: baseId + 1000, // Ensure unique ID
        type: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 pt-8">
      {/* Header */}
      <div className="flex-shrink-0 ps-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="mb-6 flex items-center gap-3">
            {/* Small logo */}
            {/* Next.js Image component for logo */}
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-0">
              Content Analysis
            </h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white ml-12"
                    : "bg-white text-gray-800 mr-12 shadow-sm border border-gray-200"
                }`}
              >
                {message.type === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <span className="text-xs font-medium text-purple-600">
                      AI Analyst
                    </span>
                  </div>
                )}
                <div
                  className={`prose prose-sm max-w-none ${
                    message.type === "user" ? "prose-invert" : ""
                  }`}
                >
                  {message.content.includes("#") ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(
                            /# (.*$)/gm,
                            '<h1 class="text-xl font-bold mb-3 text-gray-900">$1</h1>'
                          )
                          .replace(
                            /## (.*$)/gm,
                            '<h2 class="text-lg font-semibold mb-2 mt-4 text-gray-800">$2</h2>'
                          )
                          .replace(
                            /### (.*$)/gm,
                            '<h3 class="text-md font-medium mb-2 mt-3 text-gray-700">$3</h3>'
                          )
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="font-semibold text-gray-900">$1</strong>'
                          )
                          .replace(
                            /- (.*$)/gm,
                            '<div class="flex items-start gap-2 mb-1"><span class="text-blue-600 mt-1">•</span><span>$1</span></div>'
                          )
                          .replace(/\n\n/g, '<div class="mb-3"></div>')
                          .replace(/\n/g, "<br>"),
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3 text-xs opacity-70">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 mr-12 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-xs font-medium text-purple-600">
                    AI Analyst
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span className="text-sm text-gray-600 ml-2">
                    Analyzing content...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 lg:p-6 bg-white border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Paste content URL or describe what you'd like to analyze..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none min-h-[48px] max-h-32"
                rows={1}
                disabled={isAnalyzing}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 128) + "px";
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isAnalyzing}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors flex-shrink-0 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Paste URLs from LinkedIn, Twitter, Instagram, TikTok, or describe
            your content for detailed analysis
          </p>
        </div>
      </div>
    </div>
  );
}
