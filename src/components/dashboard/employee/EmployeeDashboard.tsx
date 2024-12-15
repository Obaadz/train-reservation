import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Train,
  Calendar,
  Clock,
  FileText,
  Settings,
  UserCog,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import EmployeeStats from "./EmployeeStats";
import EmployeeSchedule from "./EmployeeSchedule";
import LeaveRequests from "./LeaveRequests";
import EmployeeProfile from "./EmployeeProfile";
import PassengerManagement from "./PassengerManagement";
import EmployeeManagement from "./EmployeeManagement";
import BookingsManagement from "./BookingsManagement";
import OperationsOverview from "./OperationsOverview";

const EmployeeDashboard: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("operations");

  const canManagePassengers = ["ADMIN", "STAFF", "MANAGER"].includes(user?.role || "");
  const canManageEmployees = ["ADMIN", "MANAGER"].includes(user?.role || "");

  const tabs = [
    { id: "operations", label: t("operationsOverview"), icon: Train },
    { id: "schedule", label: t("schedule"), icon: Calendar },
    { id: "leave", label: t("leaveRequests"), icon: FileText },
    { id: "bookings", label: t("bookingManagement"), icon: BookOpen },
    ...(canManagePassengers
      ? [{ id: "passengers", label: t("passengerManagement"), icon: UserCog }]
      : []),
    ...(canManageEmployees
      ? [{ id: "employees", label: t("employeeManagement"), icon: UserPlus }]
      : []),
    { id: "profile", label: t("profile"), icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "operations":
        return <OperationsOverview />;
      case "schedule":
        return <EmployeeSchedule />;
      case "leave":
        return <LeaveRequests />;
      case "bookings":
        return <BookingsManagement />;
      case "passengers":
        return canManagePassengers ? <PassengerManagement /> : null;
      case "employees":
        return canManageEmployees ? <EmployeeManagement /> : null;
      case "profile":
        return <EmployeeProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default EmployeeDashboard;
