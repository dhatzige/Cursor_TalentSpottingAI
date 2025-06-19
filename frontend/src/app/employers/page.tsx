import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BrainCircuit, BarChart3, FileCheck, GraduationCap, ClipboardList, Users2, LucideIcon } from 'lucide-react';


const iconMap: { [key: string]: LucideIcon } = {
  BrainCircuit,
  BarChart3,
  FileCheck,
  GraduationCap,
  ClipboardList,
  Users2,
};

const EMPLOYER_FEATURES = [
  {
    icon: 'BrainCircuit',
    title: 'Smarter Sourcing with AI',
    description: 'Our AI-powered engine goes beyond keywords to match candidates based on skills, experience, and cultural fit, delivering you a shortlist of top talent.'
  },
  {
    icon: 'BarChart3',
    title: 'Data-Driven Decisions',
    description: 'Leverage real-time analytics to track key hiring metrics, monitor pipeline health, and optimize your recruitment strategy for better outcomes.'
  },
  {
    icon: 'FileCheck',
    title: 'Streamlined Screening',
    description: 'Automate resume screening and initial qualification checks to save countless hours and focus your energy on the most promising applicants.'
  },
  {
    icon: 'GraduationCap',
    title: 'Access Emerging Talent',
    description: 'Tap into our exclusive network of university partners to connect with high-potential graduates and build your future workforce.'
  },
  {
    icon: 'ClipboardList',
    title: 'Custom Skills Assessments',
    description: 'Verify candidate abilities with tailored, role-specific assessments that measure true competency and predict on-the-job success.'
  },
  {
    icon: 'Users2',
    title: 'Hire Better, Together',
    description: 'Facilitate team collaboration with shared feedback, streamlined interview scheduling, and centralized decision-making to hire the right fit, faster.'
  }
];

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={false} />
      
      {/* Hero Section */}
      <header className="py-20 relative">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-full max-w-3xl mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hire Smarter, <span className="animated-gradient-text">Not Harder.</span></h1>
            <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
              Connect with top-tier talent perfectly matched to your roles. Our intelligent platform streamlines your entire hiring process, from sourcing to offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/create-account?role=employer" 
                className="px-8 py-3 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-colors text-center shadow-md"
              >
                Get Started for Free
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-gray-800/80 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Top Companies Choose TalentSpottingAI</h2>
            <p className="text-gray-300 text-lg mb-12">
                We provide an end-to-end hiring solution designed to help you find, engage, and hire the world's best talent.
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent>
              {EMPLOYER_FEATURES.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <CarouselItem key={index} className="pt-1 md:basis-1/2 lg:basis-1/3 flex">
                    <FeatureCard icon={Icon} title={feature.title} description={feature.description} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-blue-400 hover:text-blue-300 border-blue-500/50 hover:border-blue-400 disabled:border-gray-700 disabled:text-gray-500" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-blue-400 hover:text-blue-300 border-blue-500/50 hover:border-blue-400 disabled:border-gray-700 disabled:text-gray-500" />
          </Carousel>
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="py-16 bg-gradient-to-b from-[#0c1122] to-[#131b39]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Flexible Plans for Every Organization</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Choose the plan that works best for your hiring needs and company size.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-[#131b39]/70 rounded-lg border border-gray-800 overflow-hidden">
              <div className="bg-[#172042] p-6">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-2">$199<span className="text-sm font-normal text-gray-400">/month</span></div>
                <p className="text-gray-300">Perfect for small businesses with occasional hiring needs.</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>5 active job postings</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Basic AI matching</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Applicant tracking system</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Email support</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link 
                    href="/create-account?role=employer&plan=starter" 
                    className="w-full py-2 bg-blue-600 text-white rounded-md text-center block hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Professional Plan */}
            <div className="bg-[#131b39]/70 rounded-lg border border-blue-500 overflow-hidden shadow-xl shadow-blue-500/10 scale-105 z-10">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
                <div className="bg-blue-800/30 text-xs font-bold text-white px-3 py-1 rounded-full w-fit mb-3">MOST POPULAR</div>
                <h3 className="text-xl font-bold mb-2">Professional</h3>
                <div className="text-3xl font-bold mb-2">$499<span className="text-sm font-normal text-gray-200">/month</span></div>
                <p className="text-gray-100">Ideal for growing companies with regular hiring needs.</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>25 active job postings</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Advanced AI matching</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Custom assessment creation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Candidate comparison tools</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Priority support</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link 
                    href="/create-account?role=employer&plan=professional" 
                    className="w-full py-2 bg-white text-blue-900 rounded-md text-center block hover:bg-gray-100 transition-colors font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-[#131b39]/70 rounded-lg border border-gray-800 overflow-hidden">
              <div className="bg-[#172042] p-6">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold mb-2">Custom<span className="text-sm font-normal text-gray-400"> pricing</span></div>
                <p className="text-gray-300">For large organizations with complex hiring needs.</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Unlimited job postings</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Premium AI matching</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link 
                    href="/contact?enterprise=true" 
                    className="w-full py-2 bg-blue-600 text-white rounded-md text-center block hover:bg-blue-700 transition-colors"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-[#0a0f1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#131b39]/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-4">
                  TS
                </div>
                <div>
                  <h4 className="font-semibold">Thomas Smith</h4>
                  <p className="text-sm text-gray-400">CTO, InnovateTech</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "TalentSpottingAI has transformed our hiring process. We've reduced our time-to-hire by 35% and improved the quality of our technical hires significantly."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-[#131b39]/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-4">
                  SR
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Rodriguez</h4>
                  <p className="text-sm text-gray-400">Head of HR, GrowthMarketing</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The AI matching capability is incredible. It surfaces candidates that perfectly match our requirements, saving us countless hours of manual screening."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-[#131b39]/30 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-4">
                  JL
                </div>
                <div>
                  <h4 className="font-semibold">James Lee</h4>
                  <p className="text-sm text-gray-400">Recruiting Manager, HealthTech Solutions</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "We've been able to build diverse, talented teams faster than ever before. The university partnerships have given us access to exceptional early-career talent."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#0c1122]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Dream Team?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Stop searching, start hiring. See how TalentSpottingAI can revolutionize your recruitment strategy and connect you with the talent that matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create-account?role=employer" 
              className="px-8 py-3 bg-white text-blue-900 rounded-md hover:bg-gray-100 transition-colors font-medium inline-block"
            >
              Start Hiring Now
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3 border border-white text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors font-medium inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
