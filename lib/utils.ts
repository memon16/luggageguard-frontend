// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import type { TimeSlot, PriceCalculation } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy • hh:mm a');
}

export function getTimeSlots(): TimeSlot[] {
  return [
    { value: '08:00-10:00', label: '8:00 AM - 10:00 AM', available: true },
    { value: '10:00-12:00', label: '10:00 AM - 12:00 PM', available: true },
    { value: '12:00-14:00', label: '12:00 PM - 2:00 PM', available: true },
    { value: '14:00-16:00', label: '2:00 PM - 4:00 PM', available: true },
    { value: '16:00-18:00', label: '4:00 PM - 6:00 PM', available: true },
    { value: '18:00-20:00', label: '6:00 PM - 8:00 PM', available: true },
  ];
}

export function calculatePrice(
  numberOfBags: number,
  storageDays: number,
  basePricePerBag: number = 15,
  pricePerDayPerBag: number = 8
): PriceCalculation {
  const basePrice = numberOfBags * basePricePerBag;
  const storagePrice = numberOfBags * storageDays * pricePerDayPerBag;
  const subtotal = basePrice + storagePrice;
  
  // Apply discounts
  let discount = 0;
  
  // Multi-day discount
  if (storageDays >= 7) {
    discount += subtotal * 0.15; // 15% off for 7+ days
  } else if (storageDays >= 3) {
    discount += subtotal * 0.10; // 10% off for 3-6 days
  }
  
  // Multiple bags discount
  if (numberOfBags >= 3) {
    discount += subtotal * 0.05; // 5% off for 3+ bags
  }
  
  const total = subtotal - discount;
  
  const breakdown = [
    { label: `Base price (${numberOfBags} bag${numberOfBags > 1 ? 's' : ''})`, amount: basePrice },
    { label: `Storage (${storageDays} day${storageDays > 1 ? 's' : ''})`, amount: storagePrice },
  ];
  
  if (discount > 0) {
    breakdown.push({ label: 'Discount', amount: -discount });
  }
  
  return {
    basePrice,
    storagePrice,
    subtotal,
    discount,
    total,
    breakdown,
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PICKED_UP: 'bg-purple-100 text-purple-800',
    IN_STORAGE: 'bg-indigo-100 text-indigo-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PICKED_UP: 'Picked Up',
    IN_STORAGE: 'In Storage',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };
  
  return statusLabels[status] || status;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export async function handleApiError(error: any): Promise<string> {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
