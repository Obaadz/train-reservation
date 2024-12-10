import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, Calendar } from "lucide-react";

const EmployeeSchedule: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentWeek = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{t("weeklySchedule")}</h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {currentWeek.map((date, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              date.toDateString() === new Date().toDateString()
                ? "bg-indigo-50 border-2 border-indigo-200"
                : "bg-gray-50"
            }`}
          >
            <div className="text-sm font-medium text-gray-500">{weekDays[index]}</div>
            <div className="text-lg font-semibold mt-1">{date.getDate()}</div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>08:00 - 16:00</span>
              </div>
              <div className="text-xs text-gray-500">Morning Shift</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSchedule;
