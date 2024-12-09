import React from 'react';
import { useTranslation } from 'react-i18next';
import { Train, User, CreditCard, CheckCircle } from 'lucide-react';

interface ReservationStepsProps {
  currentStep: number;
}

const ReservationSteps: React.FC<ReservationStepsProps> = ({ currentStep }) => {
  const { t } = useTranslation(['booking']);

  const steps = [
    { icon: Train, label: t('journeyDetails') },
    { icon: User, label: t('passengerDetails') },
    { icon: CreditCard, label: t('payment') },
    { icon: CheckCircle, label: t('confirmation') }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex-1">
              <div className="relative">
                {index !== 0 && (
                  <div
                    className={`absolute top-1/2 w-full h-1 -left-1/2 ${
                      isCompleted ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
                <div className="relative flex flex-col items-center group">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-indigo-600 text-white'
                        : isCurrent
                        ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReservationSteps;