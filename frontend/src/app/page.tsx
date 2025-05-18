import Navbar from '@/components/layout/Navbar';
import SearchBar from '@/components/home/SearchBar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={true} />
      
      <section className="min-h-[95vh] flex items-center justify-center relative py-24 mt-[-1px]">
        {/* Separator line to distinguish from navbar */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        
        {/* Background Elements */}
        <div className="hero-bg-animation"></div>
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="w-full max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animated-gradient-hero mt-[-130px]">Find Your Dream Job</h1>
            <p className="text-xl text-gray-300 mb-14">
              Connect with top companies and discover opportunities that match your
              skills and aspirations.
            </p>
            
            {/* Search Bar - Main Focus */}
            <div className="max-w-3xl mx-auto mb-16 transform scale-105 transition-all duration-300 hover:scale-[1.07] shadow-2xl">
              <SearchBar className="rounded-lg shadow-inner text-lg w-full" />
            </div>
            
            <div className="flex justify-center space-x-5 mt-6">
              <Link 
                href="/jobs" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Find Jobs
              </Link>
              <Link 
                href="/create-account" 
                className="bg-gray-800/80 border border-gray-700 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="h-14 w-14 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mr-5">
                <span style={{ fontSize: '24px' }}>🧠</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
                <p className="text-gray-300">Our advanced AI algorithms analyze skills, experience, and cultural fit to find the perfect match.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="h-14 w-14 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl mr-5">
                <span style={{ fontSize: '24px' }}>🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Smart Automation</h3>
                <p className="text-gray-300">Automate repetitive tasks and streamline your hiring process with intelligent workflows.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="h-14 w-14 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mr-5">
                <span style={{ fontSize: '24px' }}>🛡️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-gray-300">Enterprise-grade security and privacy controls to protect your data and candidates.</p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="h-14 w-14 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 text-2xl mr-5">
                <span style={{ fontSize: '24px' }}>👥</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Talent Network</h3>
                <p className="text-gray-300">Access a vast network of pre-vetted professionals from top universities and companies.</p>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="h-14 w-14 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-2xl mr-5">
                <span style={{ fontSize: '24px' }}>💼</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Career Insights</h3>
                <p className="text-gray-300">Get AI-driven insights into market trends, salary ranges, and career opportunities.</p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="flex items-start p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="h-14 w-14 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl mr-5">
                <span style={{ fontSize: '24px' }}>🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Learning & Growth</h3>
                <p className="text-gray-300">Personalized learning paths and skill development recommendations for candidates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-blue-400 mb-2">500+</p>
              <p className="text-white">Active Jobs</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-purple-400 mb-2">200+</p>
              <p className="text-white">Companies</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-green-400 mb-2">10k+</p>
              <p className="text-white">Professionals</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-yellow-400 mb-2">95%</p>
              <p className="text-white">Match Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl text-gray-400 mb-8">Join the future of talent acquisition with TalentSpottingAI</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create-account" 
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">&copy; {new Date().getFullYear()} TalentSpottingAI. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
