import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Train, Clock, Users, CreditCard, Tag } from "lucide-react";
import { Journey } from "../../data/mockJourneys";
import { useNavigate } from "react-router-dom";
import { trainClasses } from "../../data/trainClasses";
import { useAuth } from "../../contexts/AuthContext";

interface JourneyCardProps {
  journey: Journey;
  onEmployeePage?: boolean;
}

const calculateLoyaltyDiscount = (loyaltyStatus: string, originalPrice: number): number => {
  const discounts = {
    BRONZE: 0,
    SILVER: 0.05, // 5% discount
    GOLD: 0.1, // 10% discount
    PLATINUM: 0.15, // 15% discount
  };

  const discountRate = discounts[loyaltyStatus as keyof typeof discounts] || 0;
  return originalPrice * (1 - discountRate);
};

const JourneyCard: React.FC<JourneyCardProps> = ({ journey, onEmployeePage }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
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

  const renderPrice = (classOption: any) => {
    const { loyaltyStatus } = user || {};
    const originalPrice = classOption.originalPrice || classOption.price;

    if (!isAuthenticated) {
      // Always show the original price for non-authenticated users
      return <span className="text-xl font-bold text-indigo-600">{originalPrice} SAR</span>;
    }

    // Calculate the discounted price using calculateLoyaltyDiscount
    const discountedPrice = calculateLoyaltyDiscount(loyaltyStatus || "BRONZE", originalPrice);

    if (discountedPrice < originalPrice) {
      // Show the discounted price and original price for authenticated users with a discount
      return (
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-500" />
            <span className="text-xl font-bold text-green-600">
              {discountedPrice.toFixed(2)} SAR
            </span>
          </div>
          <div className="text-sm text-gray-500 line-through">{originalPrice} SAR</div>
          <div className="text-xs text-green-600">
            {t("loyaltyDiscount", { status: loyaltyStatus })}
          </div>
        </div>
      );
    }

    // If no discount applies, show the original price
    return <span className="text-xl font-bold text-indigo-600">{originalPrice} SAR</span>;
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
              {!onEmployeePage && (
                <div className="flex items-center gap-1 justify-end">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  {renderPrice(classOption)}
                </div>
              )}
            </div>
          ))}
        </div>

        {!onEmployeePage && (
          <button
            onClick={handleBooking}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t("common:book")}
          </button>
        )}
      </div>
    </div>
  );
};

export default JourneyCard;
