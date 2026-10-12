// utils/discount.js
export const applyNewsletterDiscount = (price, newsletterDiscount) => {
  const numericPrice = Number(price) || 0; // ensure price is a number
  if (newsletterDiscount) {
    return numericPrice * 0.9; // 10% off
  }
  return numericPrice; // original price
};
