// Reference: Homepage.jpg Hero Section
export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-b from-blue-50 to-white text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-900">TalentSpottingAI</h1>
      <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl">
        Connecting employers, students, and universities with AI-powered talent discovery and matching.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition">Login</a>
        <a href="/create-account" className="bg-gray-200 hover:bg-gray-300 text-blue-900 px-6 py-3 rounded font-semibold transition">Sign Up</a>
      </div>
    </section>
  );
}
