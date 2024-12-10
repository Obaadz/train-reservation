import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Key, UserPlus } from 'lucide-react';
import { useApi } from '../../../utils/api';
import { useToast } from '../../../contexts/ToastContext';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import FormField from '../../auth/FormField';

interface EmployeeFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  salary: number;
  contractType: 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY';
  shiftType: 'MORNING' | 'EVENING' | 'NIGHT';
  branchLocation: string;
  role: 'RECEPTIONIST' | 'DRIVER' | 'TECHNICIAN' | 'CLEANER' | 'STAFF' | 'MANAGER';
  stationCode?: string;
  canLogin: boolean;
  password?: string;
}

const EmployeeManagement: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  const api = useApi();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    salary: 0,
    contractType: 'FULL_TIME',
    shiftType: 'MORNING',
    branchLocation: '',
    role: 'STAFF',
    canLogin: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/employees', {
        ...formData,
        hireDate: new Date().toISOString().split('T')[0]
      });

      showToast(t('success.employeeCreated'), 'success');
      setIsModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        salary: 0,
        contractType: 'FULL_TIME',
        shiftType: 'MORNING',
        branchLocation: '',
        role: 'STAFF',
        canLogin: false
      });
    } catch (error) {
      showToast(t('errors.createEmployee'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t('employeeManagement')}</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          {t('addEmployee')}
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('addEmployee')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={t('firstName')}
              required
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />

            <FormField
              label={t('middleName')}
              value={formData.middleName}
              onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
            />

            <FormField
              label={t('lastName')}
              required
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />

            <FormField
              label={t('email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />

            <FormField
              label={t('salary')}
              type="number"
              required
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('contractType')}
              </label>
              <select
                value={formData.contractType}
                onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="FULL_TIME">{t('fullTime')}</option>
                <option value="PART_TIME">{t('partTime')}</option>
                <option value="TEMPORARY">{t('temporary')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('shiftType')}
              </label>
              <select
                value={formData.shiftType}
                onChange={(e) => setFormData(prev => ({ ...prev, shiftType: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="MORNING">{t('morning')}</option>
                <option value="EVENING">{t('evening')}</option>
                <option value="NIGHT">{t('night')}</option>
              </select>
            </div>

            <FormField
              label={t('branchLocation')}
              required
              value={formData.branchLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, branchLocation: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('role')}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="STAFF">{t('staff')}</option>
                <option value="RECEPTIONIST">{t('receptionist')}</option>
                <option value="DRIVER">{t('driver')}</option>
                <option value="TECHNICIAN">{t('technician')}</option>
                <option value="CLEANER">{t('cleaner')}</option>
                <option value="MANAGER">{t('manager')}</option>
              </select>
            </div>

            <FormField
              label={t('stationCode')}
              value={formData.stationCode}
              onChange={(e) => setFormData(prev => ({ ...prev, stationCode: e.target.value }))}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="canLogin"
                checked={formData.canLogin}
                onChange={(e) => setFormData(prev => ({ ...prev, canLogin: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="canLogin" className="text-sm font-medium text-gray-700">
                {t('allowDashboardAccess')}
              </label>
            </div>

            {formData.canLogin && (
              <FormField
                label={t('password')}
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {t('create')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;