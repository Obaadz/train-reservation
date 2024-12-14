import React from "react";
import { City } from "../../data/saudiCities";
import { MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CitySelectorProps {
  cities: City[];
  selectedCity?: City;
  onSelect: (city: City | undefined) => void;
  label: string;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  availableCityIds?: string[];
}

const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCity,
  onSelect,
  label,
  placeholder,
  isOpen,
  onToggle,
  availableCityIds,
}) => {
  const { t } = useTranslation("search");
  const filteredCities = availableCityIds
    ? cities.filter((city) => availableCityIds.includes(city.id))
    : cities;

  const handleCitySelect = (city: City, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(city);
    onToggle();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(undefined);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className="relative cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <div className="w-full p-3 border rounded-lg bg-white shadow-sm hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span
                className={`${selectedCity ? "text-gray-900" : "text-gray-500"} transition-colors`}
              >
                {selectedCity ? selectedCity.nameAr : placeholder}
              </span>
            </div>
            {selectedCity && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border scale-in">
            <div className="max-h-60 overflow-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors slide-in"
                    onClick={(e) => handleCitySelect(city, e)}
                  >
                    <div
                      className="w-12 h-12 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${city.image})` }}
                    />
                    <div>
                      <div className="font-medium">{city.nameAr}</div>
                      <div className="text-sm text-gray-500">{city.nameEn}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 slide-in">
                  {t("noAvailableCities")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySelector;
