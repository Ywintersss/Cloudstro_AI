import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/mainpage/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navbar */}
      <Navbar 
        logo={<Image src="/logo.svg" alt="SocialHeat AI Logo" width={32} height={32} />}
        name="SocialHeat AI"
        homeUrl="/"
        mobileLinks={[
          { text: "Features", href: "/features" },
          { text: "Pricing", href: "/pricing" },
          { text: "About", href: "/about" },
        ]}
        actions={[
          { text: "Login", href: "/login", isButton: false },
          {
            text: "Get Started",
            href: "/signup",
            isButton: true,
            variant: "outline",
          },
        ]}
      />
      
      {/* Main Content */}
      <main className="flex flex-col min-h-screen">
        {/* Hero Section - Full Page */}
        <div className="pb-12 px-4 flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-6xl font-bold text-center text-gray-800 mb-6 transform transition-all duration-1000 hover:scale-105">
            SocialHeat AI Social Media Booster
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl leading-relaxed">
            Boost your social media presence with AI-powered tools that transform your content strategy and maximize engagement.
          </p>
          <Link href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Start Boosting Now
          </Link>
        </div>

        {/* Parallax Section 1 - Features */}
        <section className="relative min-h-screen flex items-center justify-center bg-white shadow-lg">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-8 transform transition-all duration-700 hover:translate-y-2">
              AI-Powered Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Content</h3>
                <p className="text-gray-600">Generate engaging posts with AI that understands your brand voice and audience preferences.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Auto Scheduling</h3>
                <p className="text-gray-600">Optimize posting times using machine learning to reach your audience when they're most active.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Analytics Plus</h3>
                <p className="text-gray-600">Deep insights into engagement patterns, hashtag performance, and competitor analysis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Parallax Section 2 - Benefits */}
        <section className="relative min-h-screen flex items-center justify-center bg-white shadow-lg">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-8 transform transition-all duration-700 hover:translate-y-2">
              Why Choose SocialHeat AI?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Increase Engagement by 80%</h3>
                <p className="text-gray-600">Our AI algorithms analyze millions of successful posts to help you create content that resonates with your audience and drives meaningful interactions.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Save 10+ Hours Weekly</h3>
                <p className="text-gray-600">Automate your content creation, scheduling, and engagement monitoring while maintaining authentic brand voice across all platforms.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Multi-Platform Management</h3>
                <p className="text-gray-600">Manage Instagram, Twitter, LinkedIn, and Facebook from one dashboard with platform-specific optimization for each post.</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Real-Time Insights</h3>
                <p className="text-gray-600">Monitor your performance with live analytics, trend detection, and actionable recommendations to improve your strategy.</p>
              </div>
            </div>
            
          </div>
        </section>

        {/* Parallax Section 3 - Testimonials */}
        <section className="relative min-h-screen flex items-center justify-center bg-white shadow-lg">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-12 transform transition-all duration-700 hover:translate-y-2">
              Trusted by Creators
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md">
                <p className="text-gray-700 text-lg italic mb-6">
                  "SocialHeat AI transformed my social media game. My engagement rates doubled in just 30 days, and I'm saving hours every week on content planning."
                </p>
                <div className="flex items-center justify-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Sarah Mitchell</h4>
                    <p className="text-gray-600">Digital Marketing Specialist</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md">
                <p className="text-gray-700 text-lg italic mb-6">
                  "The AI-generated content feels authentic and on-brand. It's like having a social media expert working 24/7 for my business."
                </p>
                <div className="flex items-center justify-center">
                  <div>
                    <h4 className="font-bold text-gray-800">Marcus Chen</h4>
                    <p className="text-gray-600">Small Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-20 relative min-h-screen flex items-center justify-center bg-white shadow-lg">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <h2 className="text-6xl font-bold text-gray-800 mb-8 transform transition-all duration-700 hover:translate-y-2">
              Ready to Boost Your Reach?
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join thousands of creators and businesses who are already seeing incredible results with SocialHeat AI.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
              <Link href="/signup" className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Start Free Trial
              </Link>
            </div>
            <p className="text-gray-500 mt-6">No credit card required • 14-day free trial</p>
          </div>
        </section>
      </main>
    </div>
  );
}