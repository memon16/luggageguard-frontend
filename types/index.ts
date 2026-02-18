// types/index.ts

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PICKED_UP = 'PICKED_UP',
  IN_STORAGE = 'IN_STORAGE',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  userId: string;
  
  // Pickup
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupDate: string;
  pickupTimeSlot: string;
  
  // Storage
  numberOfBags: number;
  storageDays: number;
  
  // Delivery
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  
  // Pricing
  basePrice: number;
  storagePrice: number;
  totalPrice: number;
  discountApplied: number;
  
  // Status
  status: BookingStatus;
  
  // Tracking
  operatorId?: string;
  pickupConfirmedAt?: string;
  storageConfirmedAt?: string;
  deliveryConfirmedAt?: string;
  
  // Notes
  specialInstructions?: string;
  internalNotes?: string;
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user?: User;
  payment?: Payment;
}

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  id: string;
  basePricePerBag: number;
  pricePerDayPerBag: number;
  roundTripDiscount: number;
  multiDayDiscountTiers: {
    days: number;
    discount: number;
  }[];
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
}

export interface BookingFormData {
  // Step 1: Pickup
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupDate: Date;
  pickupTimeSlot: string;
  numberOfBags: number;
  
  // Step 2: Delivery
  storageDays: number;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryDate: Date;
  deliveryTimeSlot: string;
  
  // Step 3: Additional
  specialInstructions?: string;
  promoCode?: string;
}

export interface PriceCalculation {
  basePrice: number;
  storagePrice: number;
  subtotal: number;
  discount: number;
  total: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export interface TimeSlot {
  value: string;
  label: string;
  available: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  revenueThisMonth: number;
  averageRating: number;
}
