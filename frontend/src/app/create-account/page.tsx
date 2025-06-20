export const dynamic = 'force-dynamic';

// Create Account Page
import Link from 'next/link';
import Image from 'next/image';
import CreateAccountForm from './CreateAccountForm';
import Navbar from '@/components/layout/Navbar';

export default function CreateAccountPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Navbar transparent={false} />
      
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:gap-16 items-start">
          {/* Left Side - Form */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <div className="bg-[#131b39]/50 rounded-xl p-8 border border-gray-800">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create your account</h1>
                <p className="text-gray-400">Join TalentSpottingAI to unlock your career potential</p>
              </div>
              
              <CreateAccountForm />
              
              <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <p className="text-gray-400">
                                    Already have an account? <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 font-medium">Log in</Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Benefits */}
          <div className="w-full md:w-1/2">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-900/30">
              <h2 className="text-2xl font-bold mb-6">Why join TalentSpottingAI?</h2>
              
              <ul className="space-y-6">
                <li className="flex">
                  <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">AI-Powered Matching</h3>
                    <p className="text-gray-300">Our advanced AI technology matches your skills and preferences with the perfect opportunities.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Career Fast-Track</h3>
                    <p className="text-gray-300">Get discovered by top employers and universities looking for candidates with your unique talents.</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="h-10 w-10 rounded-full bg-cyan-600/20 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Personalized Insights</h3>
                    <p className="text-gray-300">Receive tailored recommendations and feedback to help you stand out in your field.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-blue-800/30">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">JD</div>
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">KL</div>
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">RS</div>
                  </div>
                  <p className="ml-4 text-gray-300"><span className="font-bold text-white">10,000+</span> professionals already joined</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
