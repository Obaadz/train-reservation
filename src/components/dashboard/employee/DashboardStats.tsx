import React from "react";
import { useTranslation } from "react-i18next";
import { Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const DashboardStats: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);

  const stats = [
    {
      title: t("hoursThisMonth"),
      value: "160",
      description: t("outOf"),
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: t("leaveDaysRemaining"),
      value: "15",
      description: t("annualLeave"),
      icon: <Calendar className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: t("attendanceRate"),
      value: "98%",
      description: t("thisMonth"),
      icon: <CheckCircle className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: t("pendingRequests"),
      value: "2",
      description: t("awaitingApproval"),
      icon: <AlertCircle className="w-6 h-6 text-indigo-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              {stat.description && <p className="text-sm text-gray-500 mt-1">{stat.description}</p>}
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
