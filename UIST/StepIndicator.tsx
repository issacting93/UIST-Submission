import clsx from 'clsx';
import { UIST_STEPS } from './UISTConfig';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 px-4 py-3 bg-white/90 backdrop-blur border-b border-gray-200">
      {UIST_STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          {/* Step pill */}
          <button
            onClick={() => onStepClick(step.id)}
            className={clsx(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
              currentStep === step.id
                ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-200/50 scale-105'
                : currentStep > step.id
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
            )}
          >
            <span className={clsx(
              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
              currentStep === step.id
                ? 'bg-amber-950 text-amber-300'
                : currentStep > step.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-white'
            )}>
              {currentStep > step.id ? '✓' : step.id}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
            <span className="sm:hidden">{step.id}</span>
          </button>

          {/* Connector arrow */}
          {idx < UIST_STEPS.length - 1 && (
            <div className={clsx(
              'mx-1 sm:mx-2 w-4 sm:w-8 h-0.5',
              currentStep > step.id ? 'bg-green-300' : 'bg-gray-200'
            )} />
          )}
        </div>
      ))}

      {/* Paper label */}
      <div className="hidden md:block ml-4 text-[10px] text-gray-400 font-mono uppercase">
        {UIST_STEPS.find(s => s.id === currentStep)?.paper} Paper
      </div>
    </div>
  );
}
