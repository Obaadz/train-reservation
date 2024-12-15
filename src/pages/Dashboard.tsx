import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../components/dashboard/DashboardStats";
import ActiveJourneys from "../components/dashboard/ActiveJourneys";
import RecentBookings from "../components/dashboard/RecentBookings";
import BookingHistory from "../components/dashboard/BookingHistory";
import { BarChart3, Train, Users, Bell } from "lucide-react";

const Dashboard: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: t("overview"), icon: BarChart3 },
    { id: "journeys", label: t("activeJourneys"), icon: Train },
    { id: "bookings", label: t("bookingHistory"), icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <DashboardStats />
            <div className="mt-8">
              <ActiveJourneys />
            </div>
            <div className="mt-8">
              <RecentBookings />
            </div>
          </>
        );
      case "journeys":
        return <ActiveJourneys />;
      case "bookings":
        return <BookingHistory />;
      case "notifications":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">{t("notifications")}</h2>
            {/* Notifications content */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("welcome")}, {user?.name}
            </h1>
            <p className="text-gray-600">
              {t("loyaltyPoints")}: {user?.loyaltyPoints || 0}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-4 rtl:space-x-reverse">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === id
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
