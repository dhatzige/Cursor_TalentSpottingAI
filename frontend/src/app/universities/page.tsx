import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  TrendingUp,
  Network,
  Briefcase,
  Lightbulb,
  Link2,
  Award,
  LucideIcon
} from 'lucide-react';

const universityIconMap: { [key: string]: LucideIcon } = {
  TrendingUp,
  Network,
  Briefcase,
  Lightbulb,
  Link2,
  Award,
};

const UNIVERSITY_FEATURES = [
  {
    icon: 'TrendingUp',
    title: 'Boost Graduate Outcomes',
    description: 'Leverage real-time employment data and analytics to track graduate success, enhance career services, and inform curriculum development.'
  },
  {
    icon: 'Network',
    title: 'Expand Employer Partnerships',
    description: 'Connect your institution with a vast network of companies actively seeking diverse talent, opening new doors for your students.'
  },
  {
    icon: 'Briefcase',
    title: 'Unlock Exclusive Opportunities',
    description: 'Provide students access to a curated selection of internships, co-op programs, and entry-level roles from leading organizations.'
  },
  {
    icon: 'Lightbulb',
    title: 'Enhance Curriculum Relevance',
    description: 'Gain valuable insights from industry trends and employer feedback to ensure your academic programs align with current market demands.'
  },
  {
    icon: 'Link2',
    title: 'Streamline Career Services',
    description: 'Seamlessly integrate our platform with your existing career services tools to enhance job matching, reporting, and student support.'
  },
  {
    icon: 'Award',
    title: 'Elevate Institutional Profile',
    description: 'Showcase your university\'s commitment to student success and career readiness, attracting top students and prestigious employer partners.'
  }
];

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={false} />
      
      {/* Hero Section */}
      <header className="py-20 relative">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-full max-w-3xl mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Empower Your Students, <span className="animated-gradient-text">Elevate Your Institution.</span></h1>
            <p className="text-gray-300 mb-6 text-lg">
              Partner with TalentSpottingAI to bridge the gap between education and employment. Equip your students with premier career opportunities and gain data-driven insights to enhance your university's impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sign-up" 
                className="px-8 py-3 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-colors text-center shadow-md"
              >
                Become a Partner
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

      {/* Benefits Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Advantages for Partner Institutions</h2>
            <p className="text-gray-300 text-lg mb-12">
                Discover how TalentSpottingAI empowers universities to enhance student career trajectories and gain critical labor market insights.
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
              {UNIVERSITY_FEATURES.map((feature, index) => {
                const Icon = universityIconMap[feature.icon];
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
      <section className="py-16 bg-[#0c1122]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Career Services?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our university partnership program and provide your students with industry-leading career resources and opportunities.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-up" 
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
      <Footer />
    </div>
  );
}
