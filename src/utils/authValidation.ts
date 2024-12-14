import { ValidationRules } from './validation';
import { getValidationMessage } from './validationMessages';

export const getLoginValidationRules = (): ValidationRules => ({
  email: [
    {
      test: (value) => Boolean(value),
      message: getValidationMessage('emailRequired')
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
      message: getValidationMessage('invalidEmail')
    }
  ],
  password: [
    {
      test: (value) => Boolean(value),
      message: getValidationMessage('passwordRequired')
    },
    {
      test: (value) => String(value).length >= 8,
      message: getValidationMessage('passwordMinLength')
    }
  ]
});

export const getRegisterValidationRules = (): ValidationRules => ({
  name: [
    {
      test: (value) => Boolean(value),
      message: getValidationMessage('nameRequired')
    },
    {
      test: (value) => String(value).length >= 3,
      message: getValidationMessage('nameMinLength')
    }
  ],
  email: [
    {
      test: (value) => Boolean(value),
      message: getValidationMessage('emailRequired')
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
      message: getValidationMessage('invalidEmail')
    }
  ],
  password: [
    {
      test: (value) => Boolean(value),
      message: getValidationMessage('passwordRequired')
    },
    {
      test: (value) => String(value).length >= 8,
      message: getValidationMessage('passwordMinLength')
    }
  ],
  confirmPassword: [
    {
      test: (value) => Boolean(value),
      message: getValidationMessage('confirmPasswordRequired')
    },
    {
      test: (value, formValues) => value === formValues?.password,
      message: getValidationMessage('passwordMismatch')
    }
  ]
});