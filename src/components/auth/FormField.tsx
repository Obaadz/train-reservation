import React from 'react';
import { cn } from '../../utils/cn';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string[];
  icon?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-3 py-2 border rounded-lg shadow-sm",
              icon && "pl-10",
              error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
              className
            )}
            {...props}
          />
        </div>
        {error && error.length > 0 && (
          <p className="text-sm text-red-600 mt-1">{error[0]}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;