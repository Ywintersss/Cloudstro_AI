"use client";
import React, { useState } from "react";
import StatusOverlayLoader, { OverlayState } from "../../components/dashboard/overlay-personalization-loading";

interface FormData {
  brandVoice: string;
  contentTheme: string;
  targetAudience: string;
  brandColors: string[];
  contentDescription: string;
  thumbnailStyle: string;
  logoPlacement: string;
  autoGenerateThumbnails: boolean;
  includeTrendingElements: boolean;
  captionLength: string;
  hashtagStrategy: string;
  includeCallToAction: boolean;
  addEmojiSuggestions: boolean;
  autoGenerateHashtags: boolean;
  suggestPostingTimes: boolean;
  includeTrendingTopics: boolean;
  contentToneAnalysis: boolean;
}

type TabType = 'content' | 'thumbnail' | 'advanced';

const TabContent: React.FC<{
  activeTab: TabType;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleCheckboxChange: (field: keyof FormData) => void;
}> = ({ activeTab, formData, handleInputChange, handleCheckboxChange }) => {
  switch (activeTab) {
    case 'content':
      return (
        <div className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption Length
              </label>
              <select
                value={formData.captionLength}
                onChange={(e) =>
                  handleInputChange("captionLength", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Short (50-100 characters)</option>
                <option>Medium (100-200 characters)</option>
                <option>Long (200+ characters)</option>
                <option>Auto-optimize</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtag Strategy
              </label>
              <select
                value={formData.hashtagStrategy}
                onChange={(e) =>
                  handleInputChange("hashtagStrategy", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Trending hashtags</option>
                <option>Niche-specific</option>
                <option>Brand hashtags only</option>
                <option>Mixed approach</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="rounded"
                checked={formData.includeCallToAction}
                onChange={() => handleCheckboxChange("includeCallToAction")}
              />
              <span className="text-sm text-gray-700">
                Include call-to-action
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="rounded"
                checked={formData.autoGenerateHashtags}
                onChange={() => handleCheckboxChange("autoGenerateHashtags")}
              />
              <span className="text-sm text-gray-700">
                Auto-generate hashtags
              </span>
            </div>
          </div>
        </div>
      );

    case 'thumbnail':
      return (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Thumbnail Style
            </label>
            <select
              value={formData.thumbnailStyle}
              onChange={(e) =>
                handleInputChange("thumbnailStyle", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Bold & Colorful</option>
              <option>Minimalist</option>
              <option>Professional</option>
              <option>Creative</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Placement
            </label>
            <select
              value={formData.logoPlacement}
              onChange={(e) =>
                handleInputChange("logoPlacement", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Bottom Right</option>
              <option>Bottom Left</option>
              <option>Top Right</option>
              <option>Top Left</option>
              <option>Center</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex flex-wrap gap-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="rounded"
                checked={formData.autoGenerateThumbnails}
                onChange={() =>
                  handleCheckboxChange("autoGenerateThumbnails")
                }
              />
              <span className="text-sm text-gray-700">
                Auto-generate thumbnails
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="rounded"
                checked={formData.includeTrendingElements}
                onChange={() =>
                  handleCheckboxChange("includeTrendingElements")
                }
              />
              <span className="text-sm text-gray-700">
                Include trending elements
              </span>
            </div>
          </div>
        </div>
      );

    case 'advanced':
      return (
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="rounded"
              checked={formData.addEmojiSuggestions}
              onChange={() => handleCheckboxChange("addEmojiSuggestions")}
            />
            <span className="text-sm text-gray-700">
              Add emoji suggestions
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="rounded"
              checked={formData.suggestPostingTimes}
              onChange={() => handleCheckboxChange("suggestPostingTimes")}
            />
            <span className="text-sm text-gray-700">
              Suggest posting times
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="rounded"
              checked={formData.includeTrendingTopics}
              onChange={() => handleCheckboxChange("includeTrendingTopics")}
            />
            <span className="text-sm text-gray-700">
              Include trending topics
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="rounded"
              checked={formData.contentToneAnalysis}
              onChange={() => handleCheckboxChange("contentToneAnalysis")}
            />
            <span className="text-sm text-gray-700">
              Content tone analysis
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default function PersonalizationsContent() {
  const [formData, setFormData] = useState<FormData>({
    brandVoice: "Professional",
    contentTheme: "Technology",
    targetAudience: "",
    brandColors: ["#3B82F6", "#10B981", "#F59E0B"],
    contentDescription: "",
    thumbnailStyle: "Bold & Colorful",
    logoPlacement: "Bottom Right",
    autoGenerateThumbnails: true,
    includeTrendingElements: false,
    captionLength: "Short (50-100 characters)",
    hashtagStrategy: "Trending hashtags",
    includeCallToAction: true,
    addEmojiSuggestions: true,
    autoGenerateHashtags: true,
    suggestPostingTimes: true,
    includeTrendingTopics: false,
    contentToneAnalysis: true,
  });

  const [overlay, setOverlay] = useState<OverlayState>({
    isVisible: false,
    status: 'loading',
    message: ''
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [showTabContent, setShowTabContent] = useState(false);

  // Generated content state
  const [generatedContent, setGeneratedContent] = useState<{
    thumbnail?: string;
    caption?: string;
    hashtags?: string[];
    title?: string;
    description?: string;
  } | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.brandColors];
    newColors[index] = color;
    setFormData((prev) => ({
      ...prev,
      brandColors: newColors,
    }));
  };

  const handleCheckboxChange = (field: keyof FormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const closeOverlay = () => {
    setOverlay((prev: OverlayState) => ({ ...prev, isVisible: false }));
  };

  const generateContent = async () => {
    setOverlay({
      isVisible: true,
      status: 'loading',
      message: 'Generating your personalized content...'
    });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll use example data instead of actual API call
      const mockData = {
        thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=450&fit=crop&crop=entropy&cs=tinysrgb",
        title: "Revolutionary AI Tools That Will Transform Your Workflow",
        caption: "🚀 Just discovered these incredible AI productivity tools that have completely changed how I work! From automated content creation to smart scheduling, these platforms are game-changers for any professional looking to maximize efficiency.\n\nThe future of work is here, and it's powered by artificial intelligence. Which AI tool has transformed your workflow the most?",
        hashtags: ["AI", "productivity", "workflow", "technology", "automation", "efficiency", "futureofwork", "innovation"],
        description: "A comprehensive guide to the latest AI productivity tools that are revolutionizing modern workflows and helping professionals achieve unprecedented levels of efficiency."
      };
      
      // Store the generated content
      setGeneratedContent({
        thumbnail: mockData.thumbnail,
        caption: mockData.caption,
        hashtags: mockData.hashtags,
        title: mockData.title,
        description: mockData.description
      });
      
      // Show success overlay
      setOverlay({
        isVisible: true,
        status: 'success',
        message: 'Content generated successfully! Your personalized content is ready.'
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      
      setOverlay({
        isVisible: true,
        status: 'error',
        message: `Failed to generate content: ${errorMessage}`
      });
    }
  };

  const handleTabClick = (tab: TabType) => {
    if (activeTab === tab && showTabContent) {
      setShowTabContent(false);
    } else {
      setActiveTab(tab);
      setShowTabContent(true);
    }
  };

  return (
    <div className="p-4 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Personalizations
        </h1>
        <p className="text-gray-600">
          Customize your social media presence with personalized settings and
          preferences.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:gap-6 max-w-7xl">
        {/* Essential Settings - Always Visible */}
        <div
          className="p-4 lg:p-6"
          style={{
            borderRadius: "36px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              👤 Brand Profile
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Voice
                </label>
                <select
                  value={formData.brandVoice}
                  onChange={(e) =>
                    handleInputChange("brandVoice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Authoritative</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Theme
                </label>
                <select
                  value={formData.contentTheme}
                  onChange={(e) =>
                    handleInputChange("contentTheme", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Technology</option>
                  <option>Lifestyle</option>
                  <option>Business</option>
                  <option>Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g., Young professionals, 25-35"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    handleInputChange("targetAudience", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Colors
                </label>
                <div className="flex space-x-2">
                  {formData.brandColors.map((color, index) => (
                    <input
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Description
                </label>
                <textarea
                  placeholder="Describe your content ideas, topics, or themes..."
                  value={formData.contentDescription}
                  onChange={(e) =>
                    handleInputChange("contentDescription", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Settings Section */}
        <div
          className="p-4 lg:p-6"
          style={{
            borderRadius: "36px",
            background: "#ffffff",
            border: "2px solid #e0e0e0",
            boxSizing: "border-box",
          }}
        >
          {/* Tab Headers */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleTabClick('content')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'content' && showTabContent
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 Content Settings
              <svg 
                className={`w-4 h-4 transform transition-transform ${
                  activeTab === 'content' && showTabContent ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => handleTabClick('thumbnail')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'thumbnail' && showTabContent
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎨 Thumbnail Settings
              <svg 
                className={`w-4 h-4 transform transition-transform ${
                  activeTab === 'thumbnail' && showTabContent ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => handleTabClick('advanced')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'advanced' && showTabContent
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚙️ Advanced Settings
              <svg 
                className={`w-4 h-4 transform transition-transform ${
                  activeTab === 'advanced' && showTabContent ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Tab Content */}
          {showTabContent && (
            <div className="border-t pt-4">
              <TabContent
                activeTab={activeTab}
                formData={formData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
          )}
        </div>

        {/* Generate Content Section */}
        <div className="flex justify-center">
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
                ✨ Generate Content
              </h3>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Generate details, thumbnail, and caption based on your personalization settings
              </p>
              <button
                onClick={generateContent}
                disabled={overlay.isVisible && overlay.status === 'loading'}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {overlay.isVisible && overlay.status === 'loading' ? "Generating..." : "Generate Content"}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Content Results */}
        {generatedContent && (
          <div
            className="p-4 lg:p-6 w-full"
            style={{
              borderRadius: "36px",
              background: "#ffffff",
              border: "2px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                🎯 Generated Content
              </h3>
              <button
                onClick={() => setGeneratedContent(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear Results
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thumbnail Preview */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-700">Thumbnail Preview</h4>
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                  {generatedContent.thumbnail ? (
                    <img 
                      src={generatedContent.thumbnail} 
                      alt="Generated Thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Thumbnail will appear here</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200">
                    Download
                  </button>
                  <button className="flex-1 px-3 py-2 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200">
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Content Details */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-700">Content Details</h4>
                
                {generatedContent.title && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-800">{generatedContent.title}</p>
                    </div>
                  </div>
                )}

                {generatedContent.caption && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Caption</label>
                    <div className="p-3 bg-gray-50 rounded-lg border max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{generatedContent.caption}</p>
                    </div>
                  </div>
                )}

                {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Hashtags</label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex flex-wrap gap-1">
                        {generatedContent.hashtags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {generatedContent.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <div className="p-3 bg-gray-50 rounded-lg border max-h-24 overflow-y-auto">
                      <p className="text-sm text-gray-800">{generatedContent.description}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-purple-100 text-purple-800 text-sm rounded hover:bg-purple-200">
                    Copy Caption
                  </button>
                  <button className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-800 text-sm rounded hover:bg-indigo-200">
                    Edit Content
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t">
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Save to Library
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Schedule Post
              </button>
              <button className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Export Content
              </button>
            </div>
          </div>
        )}
      </div>

      <StatusOverlayLoader overlay={overlay} onClose={closeOverlay} />
    </div>
  );
}