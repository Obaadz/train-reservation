import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../components/search/SearchForm';

const Home: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>
        
        <SearchForm />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t('popularRoutes')}
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{t('routes.riyadhMakkah')}</div>
                <div className="text-sm text-gray-500">{t('routes.dailyTrips')}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{t('routes.jeddahMadinah')}</div>
                <div className="text-sm text-gray-500">{t('routes.expressService')}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{t('routes.dammamRiyadh')}</div>
                <div className="text-sm text-gray-500">{t('routes.directTrips')}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {t('specialOffers')}
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
                <div className="font-medium text-indigo-900">{t('weekendDiscount')}</div>
                <div className="text-sm text-indigo-700">{t('bookBeforeMonth')}</div>
              </div>
              <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">{t('familyOffers')}</div>
                <div className="text-sm text-green-700">{t('familyDiscount')}</div>
              </div>
              <div className="p-4 border border-purple-100 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-900">{t('loyaltyRewards')}</div>
                <div className="text-sm text-purple-700">{t('earnPoints')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;