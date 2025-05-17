import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <div className={`bg-[#121a2e] border border-gray-800 p-6 rounded-lg ${className} hover:bg-[#172042] transition-colors`}>
      <div className="p-3 w-14 h-14 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
