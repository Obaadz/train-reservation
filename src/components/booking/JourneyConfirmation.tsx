import React from 'react';
import { useTranslation } from 'react-i18next';
import { Train, Calendar, Clock, MapPin } from 'lucide-react';

interface JourneyConfirmationProps {
  journeyDetails: {
    trainNumber: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    className: string;
    seatNumber: string;
  };
}

const JourneyConfirmation: React.FC<JourneyConfirmationProps> = ({ journeyDetails }) => {
  const { t } = useTranslation(['booking']);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{t('journeyDetails')}</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Train className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">{t('trainNumber')}</div>
            <div className="font-medium">{journeyDetails.trainNumber}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">{t('route')}</div>
            <div className="font-medium">
              {journeyDetails.from} → {journeyDetails.to}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">{t('date')}</div>
            <div className="font-medium">{journeyDetails.date}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">{t('time')}</div>
            <div className="font-medium">
              {journeyDetails.departureTime} - {journeyDetails.arrivalTime}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">{t('class')}</div>
              <div className="font-medium">{journeyDetails.className}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">{t('seatNumber')}</div>
              <div className="font-medium">{journeyDetails.seatNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyConfirmation;