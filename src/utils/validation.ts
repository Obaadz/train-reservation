type ValidationRule = {
  test: (value: any) => boolean;
  message: string;
};

type ValidationRules = {
  [key: string]: ValidationRule[];
};

export const validateField = (value: any, rules: ValidationRule[]): string[] => {
  return rules
    .filter(rule => !rule.test(value))
    .map(rule => rule.message);
};

export const validateForm = (values: any, rules: ValidationRules): { [key: string]: string[] } => {
  const errors: { [key: string]: string[] } = {};
  
  Object.keys(rules).forEach(field => {
    const fieldErrors = validateField(values[field], rules[field]);
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return errors;
};

export const commonRules = {
  required: (message: string): ValidationRule => ({
    test: value => value !== undefined && value !== null && value !== '',
    message
  }),
  
  email: (message: string): ValidationRule => ({
    test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  minLength: (length: number, message: string): ValidationRule => ({
    test: value => value.length >= length,
    message
  }),
  
  maxLength: (length: number, message: string): ValidationRule => ({
    test: value => value.length <= length,
    message
  }),
  
  matches: (regex: RegExp, message: string): ValidationRule => ({
    test: value => regex.test(value),
    message
  }),
  
  number: (message: string): ValidationRule => ({
    test: value => !isNaN(parseFloat(value)) && isFinite(value),
    message
  }),
  
  min: (min: number, message: string): ValidationRule => ({
    test: value => parseFloat(value) >= min,
    message
  }),
  
  max: (max: number, message: string): ValidationRule => ({
    test: value => parseFloat(value) <= max,
    message
  })
};