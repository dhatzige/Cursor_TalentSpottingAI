import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function OnboardingNavigation({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting = false,
  onPrevious,
  onNext,
  onSubmit
}: OnboardingNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t-2 border-gray-100 dark:border-gray-800">
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 ${
          isFirstStep 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-green-500 shadow-sm'
                  : i === currentStep
                  ? 'bg-blue-500 shadow-sm scale-125'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className={`flex items-center gap-2 px-8 py-3 font-semibold transition-all duration-200 ${
            canProceed && !isSubmitting
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Profile...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Complete Profile
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 ${
            canProceed && !isSubmitting
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
} 