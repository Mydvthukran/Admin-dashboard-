export type UserRole = 'customer' | 'professional';
export type AccountStatus = 'active' | 'blocked' | 'pending_verification' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  location: string;
  city: 'Kolkata' | 'Nabadwip' | 'Howrah' | 'Other';
  joinedDate: string;
  totalBookings: number;
  rating?: number;
  walletBalance: number;
  blockReason?: string;
  blockedAt?: string;
  blockedBy?: string;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  serviceCategory?: string;
}

export interface KYCDocument {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceCategory: string;
  experienceYears: number;
  location: string;
  docType: 'Aadhaar' | 'Voter ID' | 'Trade License' | 'Skill Certificate' | 'Police Clearance';
  docNumber: string;
  docFileUrl: string;
  selfieUrl: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'resubmission_requested';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  targetCategory: string;
  targetUrl?: string;
  badgeText?: string;
  placement: 'hero_carousel' | 'mid_feed' | 'category_header' | 'footer_spotlight';
  startDate: string;
  endDate: string;
  isActive: boolean;
  clicks: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  serviceCount: number;
  commissionRate: number; // in percentage e.g. 12%
  isActive: boolean;
  geofenceAvailability: ('Kolkata' | 'Nabadwip' | 'All West Bengal')[];
  orderPriority: number;
}

export interface ServiceListing {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  basePrice: number; // in INR
  durationMinutes: number;
  description: string;
  features: string[];
  warrantyDays: number;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  popularityScore: number;
}

export interface StaticContentPage {
  id: string;
  slug: string;
  title: string;
  lastUpdated: string;
  updatedBy: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface FAQItem {
  id: string;
  category: 'Customer' | 'Professional' | 'Payments' | 'Safety';
  question: string;
  answer: string;
  order: number;
}

export interface PaymentTransaction {
  id: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  proName: string;
  serviceName: string;
  amount: number;
  commissionAmount: number;
  proPayoutAmount: number;
  method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking' | 'Wallet';
  status: 'completed' | 'processing' | 'refunded' | 'partially_refunded';
  createdAt: string;
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  amount: number;
  reason: 'Pro No-Show' | 'Substandard Work' | 'Customer Cancelled (In Window)' | 'Duplicate Payment' | 'Other';
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  adminRemarks?: string;
}

export interface FailedTransaction {
  id: string;
  razorpayPaymentId?: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  method: string;
  errorCode: 'PAYMENT_TIMEOUT' | 'CARD_DECLINED' | 'INSUFFICIENT_FUNDS' | 'BANK_GATEWAY_DOWN' | 'USER_ABORTED';
  errorMessage: string;
  createdAt: string;
  retryCount: number;
  resolved: boolean;
}

export interface CommissionSettlement {
  id: string;
  proId: string;
  proName: string;
  serviceCategory: string;
  totalEarnings: number;
  platformCommissionRate: number;
  commissionDeducted: number;
  netPayout: number;
  settlementPeriod: string;
  payoutStatus: 'pending' | 'processing' | 'settled';
  bankAccountMasked: string;
  settledAt?: string;
}

export interface OfferCoupon {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageCount: number;
  usageLimit: number;
  applicableCategories: string[];
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'critical_alert' | 'promotional' | 'maintenance';
  targetAudience: 'all' | 'customers' | 'professionals';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentAt: string;
  sentBy: string;
  reachCount: number;
  readCount: number;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  assignedUsersCount: number;
  permissions: {
    canViewUsers: boolean;
    canBlockUsers: boolean;
    canVerifyKYC: boolean;
    canManageContent: boolean;
    canManageListings: boolean;
    canProcessRefunds: boolean;
    canViewPayments: boolean;
    canAdjustCommission: boolean;
    canSendAnnouncements: boolean;
    canManageOffers: boolean;
    canExportReports: boolean;
    canManageRoles: boolean;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  avatarUrl: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: 'User' | 'KYC' | 'Payment' | 'Refund' | 'Content' | 'Listing' | 'Coupon' | 'Role' | 'Commission';
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
