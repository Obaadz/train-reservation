import { ValidationRules } from './validation';
import i18next from 'i18next';

const t = (key: string) => i18next.t(`auth:errors.${key}`);

export const loginValidationRules: ValidationRules = {
  email: [
    {
      test: (value) => Boolean(value),
      message: t('emailRequired')
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
      message: t('invalidEmail')
    }
  ],
  password: [
    {
      test: (value) => Boolean(value),
      message: t('passwordRequired')
    },
    {
      test: (value) => String(value).length >= 8,
      message: t('passwordMinLength')
    }
  ]
};

export const registerValidationRules: ValidationRules = {
  name: [
    {
      test: (value) => Boolean(value),
      message: t('nameRequired')
    },
    {
      test: (value) => String(value).length >= 3,
      message: t('nameMinLength')
    }
  ],
  email: [
    {
      test: (value) => Boolean(value),
      message: t('emailRequired')
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
      message: t('invalidEmail')
    }
  ],
  password: [
    {
      test: (value) => Boolean(value),
      message: t('passwordRequired')
    },
    {
      test: (value) => String(value).length >= 8,
      message: t('passwordMinLength')
    }
  ],
  confirmPassword: [
    {
      test: (value) => Boolean(value),
      message: t('confirmPasswordRequired')
    },
    {
      test: (value, formValues) => value === formValues?.password,
      message: t('passwordMismatch')
    }
  ]
};