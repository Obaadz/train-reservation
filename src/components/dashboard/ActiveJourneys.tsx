import React from "react";
import { useTranslation } from "react-i18next";
import { Train, Clock, Users } from "lucide-react";

interface Journey {
  id: string;
  trainNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  occupancy: number;
  status: "ON_TIME" | "DELAYED" | "ARRIVED";
}

const mockJourneys: Journey[] = [
  {
    id: "J001",
    trainNumber: "TRN001",
    from: "Riyadh",
    to: "Dammam",
    departureTime: "08:00",
    arrivalTime: "10:15",
    occupancy: 85,
    status: "ON_TIME",
  },
  {
    id: "J002",
    trainNumber: "TRN002",
    from: "Riyadh",
    to: "Dammam",
    departureTime: "09:30",
    arrivalTime: "15:45",
    occupancy: 72,
    status: "DELAYED",
  },
];

const ActiveJourneys: React.FC = () => {
  const { t } = useTranslation();

  const getStatusColor = (status: Journey["status"]) => {
    switch (status) {
      case "ON_TIME":
        return "bg-green-100 text-green-800";
      case "DELAYED":
        return "bg-red-100 text-red-800";
      case "ARRIVED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("dashboard:activeJourneys")}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:trainNumber")}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:route")}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:time")}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:occupancy")}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:status")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockJourneys.map((journey) => (
              <tr key={journey.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">{journey.trainNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {journey.from} → {journey.to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {journey.departureTime} - {journey.arrivalTime}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${journey.occupancy}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{journey.occupancy}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      journey.status
                    )}`}
                  >
                    {t(`dashboard:status${journey.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveJourneys;
