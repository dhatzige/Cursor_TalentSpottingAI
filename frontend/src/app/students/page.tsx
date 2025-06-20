import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Footer from '@/components/layout/Footer';

import {
  SearchCode, Briefcase, Send, BarChart3, GraduationCap, UserCircle, LucideIcon
} from 'lucide-react';

const studentIconMap: { [key: string]: LucideIcon } = {
  SearchCode,
  Briefcase,
  Send,
  BarChart3,
  GraduationCap,
  UserCircle,
};

const STUDENT_FEATURES = [
  { 
    icon: 'SearchCode', 
    title: 'AI-Powered Job Matching', 
    description: 'Discover roles perfectly aligned with your skills, interests, and career goals through intelligent recommendations.' 
  },
  { 
    icon: 'Send', 
    title: 'Streamlined Applications', 
    description: 'Apply to your dream jobs faster with a polished profile and simplified one-click application process.' 
  },
  { 
    icon: 'BarChart3', 
    title: 'Track Your Progress', 
    description: 'Stay informed with real-time updates on your applications, from submission to interview scheduling.' 
  },
  { 
    icon: 'Briefcase', 
    title: 'Exclusive Career Resources', 
    description: 'Access expert guides, skill-building workshops, and tools designed to accelerate your career growth.' 
  },
  { 
    icon: 'GraduationCap', 
    title: 'Leverage University Network', 
    description: 'Tap into exclusive job postings and connections facilitated through your university partnerships.' 
  },
  { 
    icon: 'UserCircle', 
    title: 'Build a Standout Profile', 
    description: 'Craft a compelling professional narrative showcasing your projects, achievements, and unique qualifications.' 
  }
];

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={false} />
      
      {/* Hero Section */}
      <header className="py-20 relative">
        
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-full max-w-3xl mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Jumpstart Your <span className="animated-gradient-text">Career</span></h1>
            <p className="text-gray-300 mb-6 text-lg">
              Find opportunities aligned with your skills, connect with top employers, and get personalized guidance to advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sign-up" 
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

        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Unlock Your Potential with TalentSpottingAI</h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            We provide the tools and connections you need to navigate the job market successfully and launch a fulfilling career.
          </p>
          <Carousel 
            opts={{ align: "start", loop: true }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent>
              {STUDENT_FEATURES.map((feature, index) => {
                const IconComponent = studentIconMap[feature.icon];
                return (
                  <CarouselItem key={index} className="pt-1 md:basis-1/2 lg:basis-1/3 flex">
                    <FeatureCard icon={IconComponent} title={feature.title} description={feature.description} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-blue-400 hover:text-blue-300 border-blue-500/50 hover:border-blue-400 disabled:border-gray-700 disabled:text-gray-500" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-blue-400 hover:text-blue-300 border-blue-500/50 hover:border-blue-400 disabled:border-gray-700 disabled:text-gray-500" />
          </Carousel>

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
      <section className="py-20 bg-[#0c1122]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who've found their perfect career match through TalentSpottingAI.</p>
          <Link 
            href="/sign-up" 
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium inline-block shadow-md"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
