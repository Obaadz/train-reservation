import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Briefcase, Users, Wifi, UtensilsCrossed, Tv, Battery, Maximize } from 'lucide-react';
import { TrainClass, trainClasses } from '../../data/trainClasses';

interface ClassSelectorProps {
  selectedClass: string;
  onSelect: (classId: string) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ selectedClass, onSelect }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const getClassIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown':
        return <Crown className="w-6 h-6" />;
      case 'briefcase':
        return <Briefcase className="w-6 h-6" />;
      case 'users':
        return <Users className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const renderFeatureIcon = (feature: keyof TrainClass['features']) => {
    switch (feature) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'meals':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'entertainment':
        return <Tv className="w-4 h-4" />;
      case 'powerOutlets':
        return <Battery className="w-4 h-4" />;
      case 'extraLegroom':
        return <Maximize className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {trainClasses.map((trainClass) => (
        <div
          key={trainClass.id}
          className={`cursor-pointer rounded-lg p-4 transition-all ${
            selectedClass === trainClass.id
              ? 'bg-indigo-50 border-2 border-indigo-500'
              : 'bg-white border-2 border-gray-200 hover:border-indigo-200'
          }`}
          onClick={() => onSelect(trainClass.id)}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              selectedClass === trainClass.id ? 'bg-indigo-100' : 'bg-gray-100'
            }`}>
              {getClassIcon(trainClass.icon)}
            </div>
            <div>
              <h3 className="font-medium">
                {isArabic ? trainClass.nameAr : trainClass.nameEn}
              </h3>
              <p className="text-sm text-gray-500">
                {isArabic ? trainClass.descriptionAr : trainClass.descriptionEn}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(trainClass.features).map(([feature, enabled]) => 
              enabled && (
                <div
                  key={feature}
                  className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {renderFeatureIcon(feature as keyof TrainClass['features'])}
                  <span>{t(`features.${feature}`)}</span>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassSelector;