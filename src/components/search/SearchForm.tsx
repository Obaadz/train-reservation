import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import CitySelector from './CitySelector';
import DatePicker from './DatePicker';
import SearchResults from './SearchResults';
import { City, saudiCities } from '../../data/saudiCities';
import { generateMockJourneys } from '../../data/mockJourneys';
import { getAvailableDestinations, getAvailableOrigins } from '../../data/trainRoutes';

const SearchForm: React.FC = () => {
  const { t } = useTranslation(['search', 'common']);
  const [fromCity, setFromCity] = useState<City | undefined>();
  const [toCity, setToCity] = useState<City | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<ReturnType<typeof generateMockJourneys>>();
  const [availableDestinations, setAvailableDestinations] = useState<string[]>();
  const [availableOrigins, setAvailableOrigins] = useState<string[]>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.city-selector')) {
        setIsFromOpen(false);
        setIsToOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (fromCity) {
      setAvailableDestinations(getAvailableDestinations(fromCity.id));
    } else {
      setAvailableDestinations(undefined);
      if (toCity) {
        setAvailableOrigins(getAvailableOrigins(toCity.id));
      }
    }
  }, [fromCity]);

  useEffect(() => {
    if (toCity) {
      setAvailableOrigins(getAvailableOrigins(toCity.id));
    } else {
      setAvailableOrigins(undefined);
      if (fromCity) {
        setAvailableDestinations(getAvailableDestinations(fromCity.id));
      }
    }
  }, [toCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCity && toCity && selectedDate) {
      const results = generateMockJourneys(fromCity, toCity, selectedDate.toISOString());
      setSearchResults(results);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="city-selector">
              <CitySelector
                cities={saudiCities}
                selectedCity={fromCity}
                onSelect={setFromCity}
                label={t('from')}
                placeholder={t('selectCity')}
                isOpen={isFromOpen}
                onToggle={() => {
                  setIsFromOpen(!isFromOpen);
                  setIsToOpen(false);
                }}
                availableCityIds={toCity ? availableOrigins : undefined}
              />
            </div>

            <div className="city-selector">
              <CitySelector
                cities={saudiCities}
                selectedCity={toCity}
                onSelect={setToCity}
                label={t('to')}
                placeholder={t('selectCity')}
                isOpen={isToOpen}
                onToggle={() => {
                  setIsToOpen(!isToOpen);
                  setIsFromOpen(false);
                }}
                availableCityIds={fromCity ? availableDestinations : undefined}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePicker
              selectedDate={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              label={t('date')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('passengers')}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full p-3 pr-3 pl-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
          >
            {t('searchButton')}
          </button>
        </form>
      </div>

      {searchResults && (
        <div className="mt-8">
          <SearchResults journeys={searchResults} />
        </div>
      )}
    </div>
  );
};

export default SearchForm;