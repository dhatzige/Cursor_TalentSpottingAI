import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={false} />
      
      {/* Hero Section */}
      <header className="py-20 relative">
        <div className="hero-bg-animation"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect Your <span className="text-indigo-400">Students</span> With Opportunities</h1>
            <p className="text-gray-300 mb-6 text-lg">
              Partner with TalentSpottingAI to help your students find quality employment opportunities and track their career progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/create-account?role=university" 
                className="px-8 py-3 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-colors text-center shadow-md"
              >
                Become a Partner
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-gray-800/80 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Request Demo
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700">
              <Image 
                src="/images/university-dashboard-preview.jpg" 
                alt="University Partner Dashboard" 
                width={600} 
                height={400}
                className="w-full rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">University Partner Dashboard</h3>
                <p className="text-gray-300 mb-4">Track student engagement, measure employment outcomes, and connect with employer partners.</p>
                <Link href="/university-dashboard" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  See how it works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-16 bg-[#0c1122]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Partner Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Employment Metrics</h3>
              <p className="text-gray-300">
                Track employment rates, salary data, and career trajectories for your graduates with real-time analytics.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Employer Network</h3>
              <p className="text-gray-300">
                Connect with our network of 500+ employers looking to hire qualified candidates from partner universities.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Opportunities</h3>
              <p className="text-gray-300">
                Gain access to exclusive job postings, internships, and co-op programs specifically for your students.
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Curriculum Insights</h3>
              <p className="text-gray-300">
                Receive industry feedback and market trends to align curriculum with employer needs and student outcomes.
              </p>
            </div>
            
            {/* Benefit 5 */}
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Career Services Integration</h3>
              <p className="text-gray-300">
                Integrate with your career services department to streamline job recommendations and application tracking.
              </p>
            </div>
            
            {/* Benefit 6 */}
            <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm">
              <div className="text-indigo-400 text-2xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">University Branding</h3>
              <p className="text-gray-300">
                Showcase your university's brand and achievements to employers and enhance institutional reputation.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partner Universities */}
      <section className="py-16 bg-gradient-to-b from-[#0c1122] to-[#131b39]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Partner Universities</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Join these prestigious institutions that are already helping their students succeed with TalentSpottingAI.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* University Logos (placeholder) */}
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">Stanford University</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">MIT</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">UC Berkeley</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">Harvard University</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">University of Michigan</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">Georgia Tech</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">UCLA</p>
            </div>
            <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center p-4">
              <p className="text-gray-400 font-medium">NYU</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-[#0a0f1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Universities Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#131b39]/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                  DR
                </div>
                <div>
                  <h4 className="font-semibold">Dr. Rebecca Chen</h4>
                  <p className="text-sm text-gray-400">Career Services Director, Pacific University</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "TalentSpottingAI has transformed how we connect students with employers. The analytics dashboard gives us unprecedented visibility into employment outcomes, which has been invaluable for accreditation reporting."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-[#131b39]/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-4">
                  JW
                </div>
                <div>
                  <h4 className="font-semibold">James Wilson, PhD</h4>
                  <p className="text-sm text-gray-400">Dean of Students, Westlake College</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Since partnering with TalentSpottingAI, we've seen a 32% increase in employment rates for our graduates. Their AI matching technology ensures our students find opportunities that truly align with their skills and career goals."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Career Services?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our university partnership program and provide your students with industry-leading career resources and opportunities.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create-account?role=university" 
              className="px-8 py-3 bg-white text-indigo-900 rounded-md hover:bg-gray-100 transition-colors font-medium inline-block"
            >
              Partner With Us
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3 border border-white text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors font-medium inline-block"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
