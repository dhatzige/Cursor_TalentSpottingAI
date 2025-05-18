import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={false} />
      
      {/* Hero Section */}
      <header className="py-20 relative">
        <div className="hero-bg-animation"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Jumpstart Your <span className="text-blue-400">Career</span></h1>
            <p className="text-gray-300 mb-6 text-lg">
              Find opportunities aligned with your skills, connect with top employers, and get personalized guidance to advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/create-account?role=student" 
                className="px-8 py-3 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-colors text-center shadow-md"
              >
                Get Started
              </Link>
              <Link 
                href="/jobs" 
                className="px-8 py-3 bg-gray-800/80 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700">
              <Image 
                src="/images/student-dashboard-preview.jpg" 
                alt="Student Dashboard" 
                width={600} 
                height={400}
                className="w-full rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Your Personalized Dashboard</h3>
                <p className="text-gray-300 mb-4">Track applications, get job recommendations, and manage your profile in one place.</p>
                <Link href="/student-dashboard" className="text-blue-400 hover:text-blue-300 font-medium">
                  See how it works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Student Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mb-4">
                <span style={{ fontSize: '24px' }}>🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Job Matching</h3>
              <p className="text-gray-300">
                Our algorithms analyze your skills and experiences to recommend the most relevant opportunities.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl mb-4">
                <span style={{ fontSize: '24px' }}>📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplified Applications</h3>
              <p className="text-gray-300">
                Apply to multiple jobs with a single click once your profile is complete.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mb-4">
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
              <p className="text-gray-300">
                Monitor all your applications in real-time, with status updates and interview preparation resources.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 text-2xl mb-4">
                <span style={{ fontSize: '24px' }}>🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth Resources</h3>
              <p className="text-gray-300">
                Access industry insights, skill assessments, and personalized career development paths.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl mb-4">
                <span style={{ fontSize: '24px' }}>🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">University Connections</h3>
              <p className="text-gray-300">
                Connect directly with employers partnering with your university for exclusive opportunities.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
              <div className="h-14 w-14 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-2xl mb-4">
                <span style={{ fontSize: '24px' }}>💼</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Profile</h3>
              <p className="text-gray-300">
                Create a comprehensive profile that highlights your skills, projects, and experiences to employers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/05 to-purple-500/05 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700 shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-400">Computer Science Graduate</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "TalentSpottingAI connected me with my dream role at a tech startup. The AI matching really works - I found opportunities I wouldn't have discovered otherwise!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700 shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4">
                  SP
                </div>
                <div>
                  <h4 className="font-semibold">Sophia Patel</h4>
                  <p className="text-sm text-gray-400">Marketing Major</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The application tracking system made my job search so much easier. I could see exactly where I stood with each company and prepare accordingly."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700 shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-4">
                  JT
                </div>
                <div>
                  <h4 className="font-semibold">James Taylor</h4>
                  <p className="text-sm text-gray-400">Engineering Student</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "From creating my profile to landing interviews, the platform guided me every step of the way. I secured an internship within two weeks of signing up!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who've found their perfect career match through TalentSpottingAI.</p>
          <Link 
            href="/create-account?role=student" 
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium inline-block shadow-md"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
