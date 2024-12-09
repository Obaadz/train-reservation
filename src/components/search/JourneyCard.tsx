import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Train, Clock, Users, CreditCard } from "lucide-react";
import { Journey } from "../../data/mockJourneys";
import { useNavigate } from "react-router-dom";
import { trainClasses } from "../../data/trainClasses";

interface JourneyCardProps {
  journey: Journey;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ journey }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";
  const [selectedClass, setSelectedClass] = useState(journey.classes[0].classId);

  const getClassColor = (classId: string) => {
    switch (classId) {
      case "CLS001": // First Class
        return "bg-purple-100 text-purple-800";
      case "CLS002": // Business
        return "bg-blue-100 text-blue-800";
      case "CLS003": // Economy
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBooking = () => {
    navigate(`/booking/${journey.id}?class=${selectedClass}`);
  };

  const getTrainClassName = (classId: string) => {
    const trainClass = trainClasses.find((c) => c.id === classId);
    return isArabic ? trainClass?.nameAr : trainClass?.nameEn;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Train className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-sm text-gray-500">{journey.trainNumber}</span>
              <div className="font-semibold">
                {isArabic ? journey.from.nameAr : journey.from.nameEn} →{" "}
                {isArabic ? journey.to.nameAr : journey.to.nameEn}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold">{journey.departureTime}</div>
              <div className="text-sm text-gray-500">
                {isArabic ? journey.from.nameAr : journey.from.nameEn}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="text-sm text-gray-500">{journey.duration}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{journey.arrivalTime}</div>
              <div className="text-sm text-gray-500">
                {isArabic ? journey.to.nameAr : journey.to.nameEn}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {journey.classes.map((classOption) => (
            <div
              key={classOption.classId}
              onClick={() => setSelectedClass(classOption.classId)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedClass === classOption.classId
                  ? "border-2 border-indigo-500 bg-indigo-50"
                  : "border-2 border-gray-200 hover:border-indigo-200"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getClassColor(
                    classOption.classId
                  )}`}
                >
                  {getTrainClassName(classOption.classId)}
                </span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {classOption.seatsAvailable} {t("common:seats")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-xl font-bold text-indigo-600">{classOption.price} SAR</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleBooking}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {t("common:book")}
        </button>
      </div>
    </div>
  );
};

export default JourneyCard;
