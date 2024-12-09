import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ar } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";

// Register Arabic locale
registerLocale('ar', ar);

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  label: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, label }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Calendar className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400 z-10`} />
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          locale={isArabic ? 'ar' : 'en'}
          placeholderText="DD/MM/YYYY"
          className={`w-full p-3 ${isArabic ? 'pr-12 pl-3' : 'pr-3 pl-12'} border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          showPopperArrow={false}
          popperPlacement={isArabic ? "bottom-end" : "bottom-start"}
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 8]
              }
            }
          ]}
        />
      </div>
    </div>
  );
};

export default DatePicker;