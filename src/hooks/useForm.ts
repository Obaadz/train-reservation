import { useState, useCallback } from 'react';
import { ValidationRules } from '../utils/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit: (values: T) => void | Promise<void>;
}

const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (field: keyof T, value: any) => {
      const fieldRules = validationRules[field as string];
      if (!fieldRules) return [];

      return fieldRules
        .filter(rule => !rule.test(value, values))
        .map(rule => rule.message);
    },
    [validationRules, values]
  );

  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({ ...prev, [field]: value }));
      setTouched(prev => ({ ...prev, [field]: true }));
      
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors
      }));
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    const formErrors: Record<string, string[]> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldErrors = validateField(field as keyof T, values[field]);
      if (fieldErrors.length > 0) {
        formErrors[field] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = useCallback(() => {
    return Object.keys(validationRules).every(field => {
      const fieldErrors = validateField(field as keyof T, values[field]);
      return fieldErrors.length === 0;
    });
  }, [validationRules, validateField, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid: isValid(),
    handleChange,
    handleSubmit
  };
};

export default useForm;