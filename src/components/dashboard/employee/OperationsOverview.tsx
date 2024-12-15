import React from "react";
import { useTranslation } from "react-i18next";
import { Train, Users, Percent, MapPin, Clock } from "lucide-react";

// Mock data
const activeTrains = [
  {
    id: "TRN001",
    route: "Riyadh → Dammam",
    departureTime: "08:00",
    arrivalTime: "11:30",
    status: "ON_TIME",
    loadFactor: 85,
    stations: [
      { name: "Riyadh Station", arrival: "-", departure: "08:00", status: "DEPARTED" },
      { name: "Al-Ahsa Station", arrival: "09:45", departure: "10:00", status: "EN_ROUTE" },
      { name: "Dammam Station", arrival: "11:30", departure: "-", status: "SCHEDULED" },
    ],
  },
  {
    id: "TRN002",
    route: "Jeddah → Madinah",
    departureTime: "09:30",
    arrivalTime: "12:45",
    status: "DELAYED",
    loadFactor: 92,
    stations: [
      { name: "Jeddah Station", arrival: "-", departure: "09:30", status: "DEPARTED" },
      { name: "King Abdullah Station", arrival: "11:15", departure: "11:30", status: "EN_ROUTE" },
      { name: "Madinah Station", arrival: "12:45", departure: "-", status: "SCHEDULED" },
    ],
  },
  {
    id: "TRN003",
    route: "Makkah → Jeddah",
    departureTime: "10:15",
    arrivalTime: "11:45",
    status: "ON_TIME",
    loadFactor: 78,
    stations: [
      { name: "Makkah Station", arrival: "-", departure: "10:15", status: "DEPARTED" },
      { name: "Jeddah Station", arrival: "11:45", departure: "-", status: "SCHEDULED" },
    ],
  },
];

const passengers = [
  {
    trainId: "TRN001",
    count: 245,
    details: [
      { type: "Adults", count: 180 },
      { type: "Children", count: 45 },
      { type: "Seniors", count: 20 },
    ],
  },
  {
    trainId: "TRN002",
    count: 312,
    details: [
      { type: "Adults", count: 250 },
      { type: "Children", count: 42 },
      { type: "Seniors", count: 20 },
    ],
  },
  {
    trainId: "TRN003",
    count: 198,
    details: [
      { type: "Adults", count: 150 },
      { type: "Children", count: 28 },
      { type: "Seniors", count: 20 },
    ],
  },
];

const averageLoadFactor =
  activeTrains.reduce((acc, train) => acc + train.loadFactor, 0) / activeTrains.length;

const OperationsOverview: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "bg-green-100 text-green-800";
      case "DELAYED":
        return "bg-red-100 text-red-800";
      case "DEPARTED":
        return "bg-blue-100 text-blue-800";
      case "EN_ROUTE":
        return "bg-indigo-100 text-indigo-800";
      case "SCHEDULED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("activeTrains")}</p>
              <p className="text-2xl font-semibold mt-1">{activeTrains.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Train className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("totalPassengers")}</p>
              <p className="text-2xl font-semibold mt-1">
                {passengers.reduce((acc, p) => acc + p.count, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("averageLoadFactor")}</p>
              <p className="text-2xl font-semibold mt-1">{averageLoadFactor.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Trains */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">{t("activeTrains")}</h2>
        </div>
        <div className="divide-y">
          {activeTrains.map((train) => (
            <div key={train.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Train className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{train.id}</h3>
                    <p className="text-sm text-gray-500">{train.route}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    train.status
                  )}`}
                >
                  {train.status}
                </span>
              </div>

              {/* Train Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t("departure")}</p>
                    <p className="font-medium">{train.departureTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t("arrival")}</p>
                    <p className="font-medium">{train.arrivalTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t("loadFactor")}</p>
                    <p className="font-medium">{train.loadFactor}%</p>
                  </div>
                </div>
              </div>

              {/* Station Timeline */}
              <div className="relative">
                {train.stations.map((station, index) => (
                  <div key={station.name} className="flex items-start mb-4 last:mb-0">
                    <div className="flex items-center">
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        {index !== train.stations.length - 1 && (
                          <div className="absolute top-5 left-2.5 w-0.5 h-full bg-gray-200" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{station.name}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            station.status
                          )}`}
                        >
                          {station.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {station.arrival !== "-" && <span>Arrival: {station.arrival}</span>}
                        {station.arrival !== "-" && station.departure !== "-" && <span> | </span>}
                        {station.departure !== "-" && <span>Departure: {station.departure}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Passenger Details */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">{t("passengerBreakdown")}</h4>
                <div className="grid grid-cols-3 gap-4">
                  {passengers
                    .find((p) => p.trainId === train.id)
                    ?.details.map((detail) => (
                      <div key={detail.type} className="text-sm">
                        <span className="text-gray-500">{detail.type}:</span>{" "}
                        <span className="font-medium">{detail.count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationsOverview;
