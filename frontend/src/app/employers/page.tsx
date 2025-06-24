import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Brain, Users, Target, BarChart3, Shield, Zap, LucideIcon } from 'lucide-react';

const employerIconMap: { [key: string]: LucideIcon } = {
  Brain,
  Users,
  Target,
  BarChart3,
  Shield,
  Zap,
};

const EMPLOYER_FEATURES = [
  {
    icon: 'Brain',
    title: 'Smarter Sourcing with AI',
    description: 'Find the perfect candidates faster with intelligent matching algorithms that understand both skills and cultural fit.'
  },
  {
    icon: 'Target',
    title: 'Data-Driven Decisions',
    description: 'Make informed hiring choices with comprehensive analytics and insights about candidate performance and potential.'
  },
  {
    icon: 'Users',
    title: 'Streamlined Screening',
    description: 'Reduce time-to-hire with automated screening processes and intelligent candidate ranking systems.'
  },
  {
    icon: 'BarChart3',
    title: 'Advanced Analytics',
    description: 'Track recruitment metrics, optimize your hiring funnel, and measure the success of your talent acquisition efforts.'
  },
  {
    icon: 'Shield',
    title: 'Quality Assurance',
    description: 'Access pre-vetted candidates from top universities with verified skills and academic achievements.'
  },
  {
    icon: 'Zap',
    title: 'Rapid Deployment',
    description: 'Get your hiring campaigns live quickly with easy job posting tools and automated candidate outreach.'
  }
];

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* Hero Section - Lighter background for contrast with navbar */}
      <header className="py-24 relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          <div className="w-full max-w-4xl mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">Hire Smarter, <span className="animated-gradient-text">Not Harder.</span></h1>
            <p className="text-slate-300 mb-8 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Connect with top-tier talent perfectly matched to your roles. Our intelligent platform streamlines your entire hiring process, from sourcing to offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/sign-up" 
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-200 text-center shadow-lg text-lg ring-1 ring-blue-500/20"
              >
                Start Hiring
              </Link>
              <Link 
                href="/contact" 
                className="px-10 py-4 bg-slate-800/80 border border-slate-600 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 text-center font-semibold text-lg backdrop-blur-sm"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section - Medium contrast background */}
      <section className="py-20 relative bg-gradient-to-b from-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/8 to-purple-500/8 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Transform Your Talent Acquisition with TalentSpottingAI</h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Access cutting-edge recruitment technology that connects you with exceptional candidates while reducing time-to-hire and improving quality of hires.
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
                const IconComponent = employerIconMap[feature.icon];
                return (
                  <CarouselItem key={index} className="pt-1 md:basis-1/2 lg:basis-1/3 flex">
                    <FeatureCard icon={IconComponent} title={feature.title} description={feature.description} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-emerald-400 hover:text-emerald-300 border-emerald-500/50 hover:border-emerald-400 disabled:border-gray-700 disabled:text-gray-500" />
            <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-background hidden md:flex text-emerald-400 hover:text-emerald-300 border-emerald-500/50 hover:border-emerald-400 disabled:border-gray-700 disabled:text-gray-500" />
          </Carousel>
        </div>
      </section>
      
      {/* Testimonials - Darker background for variety */}
      <section className="py-16 relative bg-gradient-to-b from-gray-900 to-slate-900 border-y border-slate-700/30">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/3 to-purple-500/3 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">What Employers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-emerald-500/20">
                  RD
                </div>
                <div>
                  <h4 className="font-semibold">Rachel Davis</h4>
                  <p className="text-sm text-slate-400">Head of Talent, TechCorp</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "TalentSpottingAI reduced our time-to-hire by 60%. The quality of candidates we're seeing is exceptional, and the AI matching is incredibly accurate."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-blue-500/20">
                  MS
                </div>
                <div>
                  <h4 className="font-semibold">Mark Stevens</h4>
                  <p className="text-sm text-slate-400">Recruitment Director, StartupX</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "The platform's analytics helped us identify the best sourcing channels and optimize our recruitment strategy. Our hiring success rate has doubled."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4 ring-2 ring-purple-500/20">
                  LW
                </div>
                <div>
                  <h4 className="font-semibold">Lisa Wang</h4>
                  <p className="text-sm text-slate-400">VP of People, GrowthCo</p>
                </div>
              </div>
              <p className="text-slate-300 italic">
                "We've hired 15 outstanding graduates through the platform this year. The pre-screening process saves us countless hours while ensuring quality."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Distinctive background */}
      <section className="py-20 bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950 border-t border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Hiring?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-300">Join hundreds of companies that have transformed their recruitment process with TalentSpottingAI.</p>
          <Link 
            href="/sign-up" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium inline-block shadow-lg hover:shadow-xl ring-1 ring-blue-500/30 hover:ring-blue-500/50"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
