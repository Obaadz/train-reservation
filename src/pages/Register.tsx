import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import FormField from '../components/auth/FormField';
import Button from '../components/common/Button';
import useForm from '../hooks/useForm';
import { registerValidationRules } from '../utils/authValidation';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation(['auth']);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useForm<RegisterForm>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationRules: registerValidationRules,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || t('errors.registerFailed'));
        }

        login(data.token);
        showToast(t('registerSuccess'), 'success');
        navigate('/dashboard');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : t('errors.registerFailed'),
          'error'
        );
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('registerTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('registerSubtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <FormField
              label={t('name')}
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              icon={<User className="h-5 w-5 text-gray-400" />}
              placeholder={t('namePlaceholder')}
            />

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

            <FormField
              label={t('confirmPassword')}
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              placeholder={t('confirmPasswordPlaceholder')}
            />
          </div>

          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
          >
            {t('registerButton')}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t('hasAccount')}{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t('loginNow')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;