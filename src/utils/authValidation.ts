import { ValidationRules, commonRules } from './validation';

export const loginValidationRules: ValidationRules = {
  email: [
    commonRules.required('البريد الإلكتروني مطلوب'),
    commonRules.email('البريد الإلكتروني غير صالح')
  ],
  password: [
    commonRules.required('كلمة المرور مطلوبة'),
    commonRules.minLength(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  ]
};

export const registerValidationRules: ValidationRules = {
  name: [
    commonRules.required('الاسم مطلوب'),
    commonRules.minLength(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
  ],
  email: [
    commonRules.required('البريد الإلكتروني مطلوب'),
    commonRules.email('البريد الإلكتروني غير صالح')
  ],
  password: [
    commonRules.required('كلمة المرور مطلوبة'),
    commonRules.minLength(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    commonRules.matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'
    )
  ],
  confirmPassword: [
    commonRules.required('تأكيد كلمة المرور مطلوب'),
    {
      test: (value, formValues) => value === formValues.password,
      message: 'كلمات المرور غير متطابقة'
    }
  ]
};