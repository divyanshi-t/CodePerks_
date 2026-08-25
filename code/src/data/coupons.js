// Vendor Coupons and Student Redemptions initial seed data
export const initialVendorCoupons = [
  {
    id: 'coup_01',
    code: 'PERK-BITE-25',
    vendor: 'Campus Bites & Supplies',
    vendorId: 'usr_vendor_1',
    discount: '25% Off Meals',
    expiryDate: '2025-12-31',
    status: 'active',
    totalRedeemed: 34,
    description: 'Flat 25% discount on all hot breakfast and lunch dishes above Rs. 100.'
  },
  {
    id: 'coup_02',
    code: 'PERK-COFFEE-FREE',
    vendor: 'Campus Bites & Supplies',
    vendorId: 'usr_vendor_1',
    discount: '100% Free Hot Coffee',
    expiryDate: '2025-11-30',
    status: 'active',
    totalRedeemed: 82,
    description: 'Complimentary single espresso or cappuccino at main counter.'
  },
  {
    id: 'coup_03',
    code: 'PERK-BOOK-30',
    vendor: 'University Stationery Hub',
    vendorId: 'usr_vendor_1',
    discount: '30% Off Spiral Notebooks',
    expiryDate: '2025-10-15',
    status: 'active',
    totalRedeemed: 19,
    description: 'Special student stationery offer on engineering notebooks.'
  },
  {
    id: 'coup_04',
    code: 'PERK-SUMMER-50',
    vendor: 'Campus Bites & Supplies',
    vendorId: 'usr_vendor_1',
    discount: '50% Off Beverages',
    expiryDate: '2025-07-01',
    status: 'expired',
    totalRedeemed: 110,
    description: 'Summer season special cooling drinks promo.'
  }
];

export const initialRedemptions = [
  {
    id: 'red_001',
    userId: 'usr_student_1',
    rewardId: 'rew_01',
    rewardName: 'Free Espresso / Cappuccino',
    vendor: 'Campus Bites & Supplies',
    pointsUsed: 150,
    couponCode: 'PERK-CP-98124A',
    redeemedAt: '2025-08-21 15:30',
    status: 'Active',
    category: 'Food',
    expiryDate: '2025-09-21',
    terms: 'Show this voucher code at the canteen cashier counter to claim.'
  }
];
