export const calculateLoyaltyDiscount = (loyaltyStatus: string, originalPrice: number): number => {
  const discounts = {
    BRONZE: 0,
    SILVER: 0.05, // 5% discount
    GOLD: 0.1, // 10% discount
    PLATINUM: 0.15, // 15% discount
  };

  const discountRate = discounts[loyaltyStatus as keyof typeof discounts] || 0;
  return originalPrice * (1 - discountRate);
};

export const getDiscountPercentage = (loyaltyStatus?: string): number => {
  switch (loyaltyStatus) {
    case 'PLATINUM': return 15;
    case 'GOLD': return 10;
    case 'SILVER': return 5;
    default: return 0;
  }
};