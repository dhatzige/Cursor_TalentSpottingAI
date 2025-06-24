"use client";

import React from "react";
import { Button } from '@/components/ui/button';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isCurrent?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
}

/**
 * Simple card visualising a subscription plan.
 */
const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect }) => {
  return (
    <div
      className={`border rounded-lg p-6 space-y-4 transition-shadow bg-white dark:bg-slate-800 ${
        plan.isCurrent ? "border-blue-600 shadow-lg" : "border-gray-200 dark:border-slate-700"
      }`}
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {plan.name}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</p>
      <ul className="space-y-2">
        {plan.features.map((feat) => (
          <li key={feat} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
            <span className="mt-1 mr-2 text-blue-600 dark:text-blue-400">✔</span> {feat}
          </li>
        ))}
      </ul>

      <Button
        variant={plan.isCurrent ? "secondary" : "primary"}
        disabled={plan.isCurrent}
        onClick={() => onSelect(plan.id)}
      >
        {plan.isCurrent ? "Current Plan" : "Choose Plan"}
      </Button>
    </div>
  );
};

export default PlanCard;
