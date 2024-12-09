import React from 'react';
import { Users, Train, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">
            +{change}% from last month
          </p>
        )}
      </div>
      <div className="p-3 bg-indigo-100 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title={t('dashboard.totalBookings')}
        value="1,234"
        icon={<Calendar className="w-6 h-6 text-indigo-600" />}
        change="12"
      />
      <StatCard
        title={t('dashboard.activeJourneys')}
        value="42"
        icon={<Train className="w-6 h-6 text-indigo-600" />}
        change="8"
      />
      <StatCard
        title={t('dashboard.totalPassengers')}
        value="856"
        icon={<Users className="w-6 h-6 text-indigo-600" />}
        change="15"
      />
      <StatCard
        title={t('dashboard.upcomingDepartures')}
        value="23"
        icon={<Clock className="w-6 h-6 text-indigo-600" />}
      />
    </div>
  );
};

export default DashboardStats;