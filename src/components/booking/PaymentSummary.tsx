import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Gift, Calculator } from 'lucide-react';

interface PaymentSummaryProps {
  basePrice: number;
  classMultiplier: number;
  discounts?: {
    type: string;
    amount: number;
  }[];
  loyaltyPoints?: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  basePrice,
  classMultiplier,
  discounts = [],
  loyaltyPoints = 0
}) => {
  const { t } = useTranslation(['booking']);

  const subtotal = basePrice * classMultiplier;
  const totalDiscounts = discounts.reduce((acc, discount) => acc + discount.amount, 0);
  const total = subtotal - totalDiscounts;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{t('paymentSummary')}</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gray-400" />
            <span>{t('basePrice')}</span>
          </div>
          <span>{basePrice} SAR</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span>{t('classMultiplier')}</span>
          </div>
          <span>x{classMultiplier}</span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center font-medium">
            <span>{t('subtotal')}</span>
            <span>{subtotal} SAR</span>
          </div>
        </div>

        {discounts.length > 0 && (
          <div className="space-y-2">
            {discounts.map((discount, index) => (
              <div key={index} className="flex justify-between items-center text-green-600">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  <span>{discount.type}</span>
                </div>
                <span>-{discount.amount} SAR</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>{t('total')}</span>
            <span>{total} SAR</span>
          </div>
        </div>

        {loyaltyPoints > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2 text-indigo-600">
              <Gift className="w-5 h-5" />
              <span>
                {t('earnLoyaltyPoints', { points: loyaltyPoints })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;