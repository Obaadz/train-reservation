import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="p-3 bg-indigo-100 rounded-full">{icon}</div>
    </div>
  </div>
);

const EmployeeStats: React.FC = () => {
  const { t } = useTranslation(['dashboard']);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('hoursThisMonth')}
          value="160"
          icon={<Clock className="w-6 h-6 text-indigo-600" />}
          description={t('outOf')} 
        />
        <StatCard
          title={t('leaveDaysRemaining')}
          value="15"
          icon={<Calendar className="w-6 h-6 text-indigo-600" />}
          description={t('annualLeave')}
        />
        <StatCard
          title={t('attendanceRate')}
          value="98%"
          icon={<CheckCircle className="w-6 h-6 text-indigo-600" />}
          description={t('thisMonth')}
        />
        <StatCard
          title={t('pendingRequests')}
          value="2"
          icon={<AlertCircle className="w-6 h-6 text-indigo-600" />}
          description={t('awaitingApproval')}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('upcomingShifts')}</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Morning Shift</p>
                  <p className="text-sm text-gray-500">08:00 AM - 04:00 PM</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Tomorrow
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeStats;