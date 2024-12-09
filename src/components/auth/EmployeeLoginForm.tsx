import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import FormField from './FormField';
import Button from '../common/Button';
import useForm from '../../hooks/useForm';
import { loginValidationRules } from '../../utils/authValidation';

interface EmployeeLoginForm {
  email: string;
  password: string;
}

const EmployeeLoginForm: React.FC = () => {
  const { t } = useTranslation(['auth']);
  const { login } = useAuth();
  const { showToast } = useToast();

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm<EmployeeLoginForm>({
    initialValues: {
      email: '',
      password: ''
    },
    validationRules: loginValidationRules,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, userType: 'employee' }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || t('errors.loginFailed'));
        }

        login(data.token);
        showToast(t('loginSuccess'), 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : t('errors.loginFailed'), 'error');
      }
    },
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <Building className="h-12 w-12 text-indigo-600" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">
        {t('employeeLoginTitle')}
      </h2>
      <p className="text-gray-600 text-center mb-8">
        {t('employeeLoginSubtitle')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label={t('email')}
          type="email"
          name="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          placeholder={t('emailPlaceholder')}
        />

        <FormField
          label={t('password')}
          type="password"
          name="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          placeholder={t('passwordPlaceholder')}
        />

        <Button type="submit" loading={isSubmitting} fullWidth size="lg">
          {t('loginButton')}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeLoginForm;