import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
  steps: string[];
}

const BookingSteps: React.FC<BookingStepsProps> = ({ currentStep, steps }) => {
  const { t } = useTranslation(['booking']);

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 relative ${
            index !== steps.length - 1 ? 'after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-gray-200 after:top-5 after:left-1/2 rtl:after:right-1/2 rtl:after:left-auto' : ''
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 relative z-10 ${
                index < currentStep
                  ? 'bg-green-600 border-green-600 text-white'
                  : index === currentStep
                  ? 'border-indigo-600 bg-white text-indigo-600'
                  : 'border-gray-300 bg-white text-gray-300'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {t(step)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingSteps;