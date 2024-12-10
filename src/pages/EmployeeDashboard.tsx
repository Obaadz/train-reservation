import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import DashboardStats from "../components/dashboard/employee/DashboardStats";
import EmployeeSchedule from "../components/dashboard/employee/EmployeeSchedule";
import LeaveRequests from "../components/dashboard/employee/LeaveRequests";
import EmployeeProfile from "../components/dashboard/employee/EmployeeProfile";
import PassengerManagement from "../components/dashboard/employee/PassengerManagement";
import EmployeeManagement from "../components/dashboard/employee/EmployeeManagement";

const EmployeeDashboard: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState("overview");

  const canManagePassengers = ["ADMIN", "STAFF", "MANAGER"].includes(user?.role || "");
  const canManageEmployees = ["ADMIN", "MANAGER"].includes(user?.role || "");

  const tabs = [
    { id: "overview", label: t("overview") },
    { id: "schedule", label: t("schedule") },
    { id: "leave", label: t("leaveRequests") },
    ...(canManagePassengers ? [{ id: "passengers", label: t("passengerManagement") }] : []),
    ...(canManageEmployees ? [{ id: "employees", label: t("employeeManagement") }] : []),
    { id: "profile", label: t("profile") },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardStats />;
      case "schedule":
        return <EmployeeSchedule />;
      case "leave":
        return <LeaveRequests />;
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("welcome")}, {user?.name}
        </h1>
        <p className="text-gray-600">{user?.role}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
