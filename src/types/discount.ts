export type Discount = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  accessType: 'public' | 'private';
  allowedUsers?: string[];
  allowedBusinesses?: string[];
  courseIds: string[];
  businessId?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateDiscountRequest = {
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  accessType: 'public' | 'private';
  allowedUsers?: string[];
  allowedBusinesses?: string[];
  courseIds?: string[];
  isActive: boolean;
};

export type UpdateDiscountRequest = {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  discountType?: 'percentage' | 'fixed';
  amount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  accessType?: 'public' | 'private';
  allowedUsers?: string[];
  allowedBusinesses?: string[];
  courseIds?: string[];
  isActive?: boolean;
};

export type DiscountResponse = {
  success: boolean;
  data: Discount[];
  totalPages?: number;
  currentPage?: number;
  totalDiscounts?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};