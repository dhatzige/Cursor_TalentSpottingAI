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
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Hero Section - Lighter background for contrast with navbar */}
      <header className="py-24 relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          <div className="w-full max-w-4xl mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">Jumpstart Your <span className="animated-gradient-text">Career</span></h1>
            <p className="text-slate-300 mb-8 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Find opportunities aligned with your skills, connect with top employers, and get personalized guidance to advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/sign-up" 
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-200 text-center shadow-lg text-lg ring-1 ring-blue-500/20"
              >
                Get Started
              </Link>
              <Link 
                href="/jobs" 
                className="px-10 py-4 bg-slate-800/80 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 text-center font-semibold text-lg backdrop-blur-sm"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - Medium contrast background */}
      <section className="py-20 relative bg-gradient-to-b from-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/8 to-purple-500/8 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Unlock Your Potential with TalentSpottingAI</h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We provide the tools and connections you need to navigate the job market successfully and launch a fulfilling career.
            </p>
          </div>
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
      
      {/* Testimonials - Darker background for variety */}
      <section className="py-16 relative bg-gradient-to-b from-gray-900 to-slate-900 border-y border-slate-700/30">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/3 to-purple-500/3 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-blue-500/20">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-slate-400">Computer Science Graduate</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "TalentSpottingAI connected me with my dream role at a tech startup. The AI matching really works - I found opportunities I wouldn't have discovered otherwise!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-purple-500/20">
                  SP
                </div>
                <div>
                  <h4 className="font-semibold">Sophia Patel</h4>
                  <p className="text-sm text-slate-400">Marketing Major</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "The application tracking system made my job search so much easier. I could see exactly where I stood with each company and prepare accordingly."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-green-500/20">
                  JT
                </div>
                <div>
                  <h4 className="font-semibold">James Taylor</h4>
                  <p className="text-sm text-slate-400">Engineering Student</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "From creating my profile to landing interviews, the platform guided me every step of the way. I secured an internship within two weeks of signing up!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Distinctive background */}
      <section className="py-20 bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950 border-t border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-300">Join thousands of students who've found their perfect career match through TalentSpottingAI.</p>
          <Link 
            href="/sign-up" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium inline-block shadow-lg hover:shadow-xl ring-1 ring-blue-500/30 hover:ring-blue-500/50"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
