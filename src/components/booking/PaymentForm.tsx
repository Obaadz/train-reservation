import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import Button from '../common/Button';

interface PaymentFormProps {
  formData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  totalAmount: number;
  loading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  totalAmount,
  loading = false
}) => {
  const { t } = useTranslation(['booking']);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

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

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cardNumber')}
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => onChange('cardNumber', formatCardNumber(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="4242 4242 4242 4242"
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
                onChange={(e) => onChange('expiryDate', formatExpiryDate(e.target.value))}
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
                onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          className="mt-6"
        >
          {t('confirmPayment')}
        </Button>

        <p className="text-sm text-gray-500 text-center mt-4">
          {t('securePayment')}
        </p>
      </form>
    </div>
  );
};

export default PaymentForm;