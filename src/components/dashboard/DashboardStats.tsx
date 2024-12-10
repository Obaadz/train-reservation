import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Train, Calendar, Clock, TrendingUp, CreditCard, MapPin, Award } from "lucide-react";
import { useApi } from "../../utils/api";

interface DashboardMetrics {
  totalBookings: number;
  activeJourneys: number;
  totalSpent: number;
  upcomingTrips: number;
  loyaltyPoints: number;
  mostVisitedCity: string;
  completedTrips: number;
  averagePrice: number;
}

const DashboardStats: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const api = useApi();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get("/passengers/metrics");
        setMetrics(response);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: t("totalBookings"),
      value: metrics?.totalBookings || 0,
      change: "+12%",
      icon: <Calendar className="w-6 h-6 text-indigo-600" />,
      trend: "up",
    },
    {
      title: t("activeJourneys"),
      value: metrics?.activeJourneys || 0,
      icon: <Train className="w-6 h-6 text-green-600" />,
      trend: "neutral",
    },
    {
      title: t("totalSpent"),
      value: `${metrics?.totalSpent || 0} SAR`,
      change: "+8%",
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      trend: "up",
    },
    {
      title: t("upcomingTrips"),
      value: metrics?.upcomingTrips || 0,
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      trend: "neutral",
    },
    {
      title: t("loyaltyPoints"),
      value: metrics?.loyaltyPoints || 0,
      change: "+15%",
      icon: <Award className="w-6 h-6 text-yellow-600" />,
      trend: "up",
    },
    {
      title: t("mostVisitedCity"),
      value: "-",
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      trend: "neutral",
    },
    {
      title: t("completedTrips"),
      value: metrics?.completedTrips || 0,
      icon: <Users className="w-6 h-6 text-teal-600" />,
      trend: "neutral",
    },
    {
      title: t("averagePrice"),
      value: `${metrics?.averagePrice || 0} SAR`,
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      trend: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              {stat.change && (
                <p
                  className={`text-sm mt-1 ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.change} {t("fromLastMonth")}
                </p>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
          </div>

          {stat.trend === "up" && (
            <div className="mt-4 h-1 bg-gray-200 rounded">
              <div className="h-1 bg-green-500 rounded" style={{ width: "70%" }}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
