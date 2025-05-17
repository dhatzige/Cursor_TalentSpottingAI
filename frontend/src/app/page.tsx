import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Navbar transparent={true} />
      
      <div className="gradient-background pt-20 pb-12">
        <div className="container mx-auto px-4 text-center pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-hero">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and aspirations.
          </p>
          
          <div className="max-w-3xl mx-auto mb-12 bg-[#0d1424] rounded-md shadow-xl overflow-hidden border border-gray-800">
            <div className="p-4 w-full flex items-center">
              <input
                type="text"
                placeholder="Search for jobs, skills, or companies..."
                className="flex-grow py-2 px-4 bg-[#0d1424] text-white outline-none placeholder-gray-500 w-full"
              />
              <button
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="mt-6 space-x-4">
            <Link
              href="/jobs"
              className="px-5 py-2 bg-blue-600 rounded-md text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/create-account"
              className="px-5 py-2 bg-white text-gray-800 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 gradient-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Why TalentSpottingAI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-blue-400 text-2xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Matching</h3>
              <p className="text-gray-300 text-sm">Our advanced AI algorithms analyze skills, experience, and cultural fit to find the perfect match.</p>
            </div>
            
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Talent Network</h3>
              <p className="text-gray-300 text-sm">Access our extensive network of pre-vetted candidates and connections with leading universities.</p>
            </div>
            
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-purple-400 text-2xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Automation</h3>
              <p className="text-gray-300 text-sm">Automate repetitive tasks and streamline your hiring process with intelligent workflows.</p>
            </div>
            
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-green-400 text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-300 text-sm">Enterprise-grade security and privacy controls to protect your data and candidates.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <section className="py-16 bg-[#121a2e]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-400 mb-2">10,000+</p>
              <p className="text-white">Candidates Placed</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-400 mb-2">98%</p>
              <p className="text-white">Client Satisfaction</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-400 mb-2">500+</p>
              <p className="text-white">Partner Companies</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-400 mb-2">95%</p>
              <p className="text-white">Retention Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-xl mb-8">Join thousands of companies who've already streamlined their recruitment process.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create-account" 
              className="px-6 py-3 bg-white text-blue-900 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Get Started for Free
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors font-medium"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
