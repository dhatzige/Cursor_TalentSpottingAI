import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Building,
  Handshake,
  LucideIcon
} from 'lucide-react';

const universityIconMap: { [key: string]: LucideIcon } = {
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Building,
  Handshake,
};

const UNIVERSITY_FEATURES = [
  {
    icon: 'TrendingUp',
    title: 'Boost Graduate Outcomes',
    description: 'Increase employment rates and career placement success with direct connections to top employers seeking your graduates.'
  },
  {
    icon: 'Handshake',
    title: 'Expand Employer Partnerships',
    description: 'Build lasting relationships with leading companies and create exclusive recruitment opportunities for your students.'
  },
  {
    icon: 'Award',
    title: 'Unlock Exclusive Opportunities',
    description: 'Provide your students with access to premium internships, graduate programs, and career advancement opportunities.'
  },
  {
    icon: 'BarChart3',
    title: 'Data-Driven Insights',
    description: 'Track student career outcomes, identify industry trends, and optimize your career services with comprehensive analytics.'
  },
  {
    icon: 'Building',
    title: 'Enhance Institution Reputation',
    description: 'Strengthen your university brand by demonstrating exceptional graduate employment rates and industry connections.'
  },
  {
    icon: 'Users',
    title: 'Support Student Success',
    description: 'Equip your career services team with advanced tools to guide students through their job search and career development.'
  }
];

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Hero Section - Lighter background for contrast with navbar */}
      <header className="py-24 relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          <div className="w-full max-w-4xl mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">Empower Your Students, <span className="animated-gradient-text">Elevate Your Institution.</span></h1>
            <p className="text-slate-300 mb-8 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Partner with TalentSpottingAI to bridge the gap between education and employment. Equip your students with premier career opportunities and gain data-driven insights to enhance your university's impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/sign-up" 
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-200 text-center shadow-lg text-lg ring-1 ring-blue-500/20"
              >
                Partner With Us
              </Link>
              <Link 
                href="/contact" 
                className="px-10 py-4 bg-slate-800/80 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 text-center font-semibold text-lg backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - Medium contrast background */}
      <section className="py-20 relative bg-gradient-to-b from-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/8 to-purple-500/8 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Transform Student Career Success with TalentSpottingAI</h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge technology to connect your students with exceptional career opportunities while gaining valuable insights into employment outcomes.
            </p>
          </div>
          <Carousel 
            opts={{ align: "start", loop: true }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
          >
            <CarouselContent>
              {UNIVERSITY_FEATURES.map((feature, index) => {
                const IconComponent = universityIconMap[feature.icon];
                return (
                  <CarouselItem key={index} className="pt-1 md:basis-1/2 lg:basis-1/3 flex">
                    <FeatureCard icon={IconComponent} title={feature.title} description={feature.description} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-amber-400 hover:text-amber-300 border-amber-500/50 hover:border-amber-400 disabled:border-gray-700 disabled:text-gray-500" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-amber-400 hover:text-amber-300 border-amber-500/50 hover:border-amber-400 disabled:border-gray-700 disabled:text-gray-500" />
          </Carousel>
        </div>
      </section>
      
      {/* Testimonials - Darker background for variety */}
      <section className="py-16 relative bg-gradient-to-b from-gray-900 to-slate-900 border-y border-slate-700/30">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/3 to-purple-500/3 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">University Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-amber-500/20">
                  DM
                </div>
                <div>
                  <h4 className="font-semibold">Dr. Maria Gonzalez</h4>
                  <p className="text-sm text-slate-400">Career Services Director, Tech University</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Our graduate employment rate increased by 40% after partnering with TalentSpottingAI. The platform connects our students with opportunities we never had access to before."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-blue-500/20">
                  JA
                </div>
                <div>
                  <h4 className="font-semibold">Prof. John Anderson</h4>
                  <p className="text-sm text-slate-400">Dean of Engineering, State University</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "The analytics dashboard gives us incredible insights into industry trends and helps us adapt our curriculum to meet employer demands effectively."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-purple-500/20">
                  SK
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Kim</h4>
                  <p className="text-sm text-slate-400">VP of Student Affairs, Business College</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "Our students now have access to exclusive internships and graduate programs. The employer partnerships have elevated our institution's reputation significantly."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Distinctive background */}
      <section className="py-20 bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950 border-t border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Student Success?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-300">Join leading universities that have revolutionized their career services with TalentSpottingAI.</p>
          <Link 
            href="/sign-up" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium inline-block shadow-lg hover:shadow-xl ring-1 ring-blue-500/30 hover:ring-blue-500/50"
          >
            Become a Partner
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
