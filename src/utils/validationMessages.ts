import i18next from 'i18next';

export const getValidationMessage = (key: string): string => {
  return i18next.t(`auth:errors.${key}`);
};