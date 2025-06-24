import { CheckCircle2, Circle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="mb-12">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex items-center justify-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
                index < currentStep
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-110 shadow-green-200 dark:shadow-green-900/50'
                  : index === currentStep
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110 shadow-blue-200 dark:shadow-blue-900/50 ring-4 ring-blue-100 dark:ring-blue-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700'
              }`}>
                {index < currentStep ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : index === currentStep ? (
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              
              {/* Step Number Badge for completed/current steps */}
              {index <= currentStep && (
                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {index + 1}
                </div>
              )}
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-1 rounded-full transition-all duration-500 ${
                  index < currentStep 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Info */}
      <div className="text-center bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
          {steps[currentStep].title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          {steps[currentStep].description}
        </p>
        
        {/* Progress Percentage */}
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 