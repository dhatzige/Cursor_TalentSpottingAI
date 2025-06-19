"use client";

import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureCarouselProps {
  features: Feature[];
  className?: string;
}

/**
 * Horizontally scrollable carousel for displaying feature cards.
 * - Mobile-first: natural swipe/scroll.
 * - Desktop: scroll wheel / track-pad, or drag with mouse.
 * - Uses CSS scroll-snap for tidy alignment.
 */
export default function FeatureCarousel({ features, className = "" }: FeatureCarouselProps) {
  return (
    <div className={className}>
      <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory">
        {features.map((feature, idx) => (
          <article
            key={idx}
            className="min-w-[260px] flex-shrink-0 snap-center bg-[#121a2e]/70 hover:bg-[#172042] transition-colors border border-gray-800 rounded-lg p-6"
          >
            <div className="w-12 h-12 flex items-center justify-center text-2xl mb-4">
              {typeof feature.icon === "string" ? (
                <span>{feature.icon}</span>
              ) : (
                feature.icon
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
