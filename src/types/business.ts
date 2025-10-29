export interface BusinessEmployee {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface BusinessCourse {
  _id: string;
  name?: string;
  thumbnail?: {
    url: string;
  };
  price?: number;
  isPublished?: boolean;
}

export interface BusinessCreator {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Business {
  _id: string;
  businessName: string;
  description: string;
  email: string;
  address: string;
  businessSector: string;
  isVerified: boolean;
  createdBy?: BusinessCreator;
  employees?: BusinessEmployee[];
  courses?: BusinessCourse[];
  createdAt: string;
}

export interface BusinessResponse {
  success: boolean;
  data: Business[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBusinesses: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
} 