export default function Features() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Matching',
      description: 'Our advanced AI algorithms analyze skills, experience, and cultural fit to find the perfect match.'
    },
    {
      icon: '🌐',
      title: 'Talent Network',
      description: 'Access a vast network of pre-vetted professionals from top universities and companies.'
    },
    {
      icon: '⚙️',
      title: 'Smart Automation',
      description: 'Automate repetitive tasks and streamline your hiring process with intelligent workflows.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security and privacy controls to protect your data and candidates.'
    },
    {
      icon: '🎓',
      title: 'Learning & Growth',
      description: 'Personalized learning paths and skill development recommendations for candidates.'
    },
    {
      icon: '📊',
      title: 'Career Insights',
      description: 'Get AI-driven insights into market trends, salary ranges, and career opportunities.'
    }
  ];

  return (
    <section className="py-16 gradient-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="p-3 w-12 h-12 bg-[#172042] rounded-full flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
