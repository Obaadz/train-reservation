import { ValidationRules } from './validation';

export const loginValidationRules: ValidationRules = {
  email: [
    {
      test: (value) => Boolean(value),
      message: 'البريد الإلكتروني مطلوب'
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
      message: 'البريد الإلكتروني غير صالح'
    }
  ],
  password: [
    {
      test: (value) => Boolean(value),
      message: 'كلمة المرور مطلوبة'
    },
    {
      test: (value) => String(value).length >= 8,
      message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }
  ]
};

export const registerValidationRules: ValidationRules = {
  name: [
    {
      test: (value) => Boolean(value),
      message: 'الاسم مطلوب'
    },
    {
      test: (value) => String(value).length >= 3,
      message: 'الاسم يجب أن يكون 3 أحرف على الأقل'
    }
  ],
  email: [
    {
      test: (value) => Boolean(value),
      message: 'البريد الإلكتروني مطلوب'
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
      message: 'البريد الإلكتروني غير صالح'
    }
  ],
  password: [
    {
      test: (value) => Boolean(value),
      message: 'كلمة المرور مطلوبة'
    },
    {
      test: (value) => String(value).length >= 8,
      message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }
  ],
  confirmPassword: [
    {
      test: (value) => Boolean(value),
      message: 'تأكيد كلمة المرور مطلوب'
    },
    {
      test: (value, formValues) => value === formValues?.password,
      message: 'كلمات المرور غير متطابقة'
    }
  ]
};