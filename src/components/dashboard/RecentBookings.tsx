import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin } from "lucide-react";

interface Booking {
  id: string;
  passengerName: string;
  from: string;
  to: string;
  date: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    passengerName: "أحمد محمد",
    from: "الرياض",
    to: "مكة المكرمة",
    date: "2024-03-15",
    status: "CONFIRMED",
  },
  {
    id: "BK002",
    passengerName: "سارة أحمد",
    from: "جدة",
    to: "المدينة المنورة",
    date: "2024-03-16",
    status: "PENDING",
  },
  {
    id: "BK003",
    passengerName: "محمد علي",
    from: "الدمام",
    to: "الرياض",
    date: "2024-03-17",
    status: "CANCELLED",
  },
];

const RecentBookings: React.FC = () => {
  const { t } = useTranslation();

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("dashboard:recentBookings")}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:bookingId")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:passenger")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:route")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:date")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("dashboard:status")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.passengerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {booking.from} → {booking.to}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {booking.date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {t(`dashboard:status${booking.status}`)}
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

export default RecentBookings;
