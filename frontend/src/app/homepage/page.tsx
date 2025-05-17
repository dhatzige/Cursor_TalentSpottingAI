// Reference: Homepage.jpg
import HeroSection from "./HeroSection";

export default function Homepage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <HeroSection />
      {/* Future sections: testimonials, how it works, partners, etc. */}
      <section className="w-full max-w-4xl mx-auto mt-12 p-6 rounded bg-gray-50 border border-gray-200 text-center">
        <p className="text-gray-500">More features coming soon...</p>
      </section>
    </main>
  );
}
