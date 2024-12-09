import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Calendar, Lock } from 'lucide-react';

interface PaymentFormProps {
  formData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  onChange: (field: string, value: string) => void;
  totalAmount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ formData, onChange, totalAmount }) => {
  const { t } = useTranslation(['booking']);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{t('payment')}</h3>
      
      <div className="mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-indigo-600">{t('totalAmount')}</div>
          <div className="text-2xl font-bold text-indigo-900">
            {totalAmount} SAR
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cardNumber')}
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => onChange('cardNumber', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('expiryDate')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => onChange('expiryDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cvv')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.cvv}
                onChange={(e) => onChange('cvv', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;