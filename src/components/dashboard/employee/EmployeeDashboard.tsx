import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Calendar, Clock, FileText, Settings, UserCog } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import EmployeeStats from './EmployeeStats';
import EmployeeSchedule from './EmployeeSchedule';
import LeaveRequests from './LeaveRequests';
import EmployeeProfile from './EmployeeProfile';
import PassengerManagement from './PassengerManagement';

const EmployeeDashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const canManagePassengers = ['ADMIN', 'STAFF', 'MANAGER'].includes(user?.role || '');

  const tabs = [
    { id: 'overview', label: t('overview'), icon: Users },
    { id: 'schedule', label: t('schedule'), icon: Calendar },
    { id: 'attendance', label: t('attendance'), icon: Clock },
    { id: 'leave', label: t('leaveRequests'), icon: FileText },
    ...(canManagePassengers ? [
      { id: 'passengers', label: t('passengerManagement'), icon: UserCog }
    ] : []),
    { id: 'profile', label: t('profile'), icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EmployeeStats />;
      case 'schedule':
        return <EmployeeSchedule />;
      case 'leave':
        return <LeaveRequests />;
      case 'passengers':
        return canManagePassengers ? <PassengerManagement /> : null;
      case 'profile':
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
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;