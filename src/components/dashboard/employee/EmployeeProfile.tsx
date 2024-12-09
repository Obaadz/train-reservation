import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Building, Calendar, Clock } from 'lucide-react';
import Button from '../../common/Button';

const EmployeeProfile: React.FC = () => {
  const { t } = useTranslation(['dashboard']);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">محمد أحمد العمري</h2>
            <p className="text-gray-500">Station Manager - Riyadh Central Station</p>
          </div>
          <Button className="ml-auto">
            {t('editProfile')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('personalInfo')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t('email')}</div>
                  <div>mohammed@trainco.sa</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t('phone')}</div>
                  <div>+966 50 123 4567</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t('department')}</div>
                  <div>Operations</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('employmentInfo')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t('joinDate')}</div>
                  <div>January 15, 2023</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t('shiftType')}</div>
                  <div>Morning Shift (8:00 AM - 4:00 PM)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;