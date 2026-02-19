import { create } from 'zustand';

interface BookingFormData {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupDate: string;
  pickupTimeSlot: string;
  numberOfBags: number;
  storageDays: number;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  specialInstructions: string;
}

interface PriceCalculation {
  basePrice: number;
  storagePrice: number;
  discount: number;
  total: number;
}

interface BookingState {
  formData: BookingFormData | null;
  priceCalculation: PriceCalculation | null;
  setFormData: (data: BookingFormData) => void;
  setPriceCalculation: (calc: PriceCalculation) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  formData: null,
  priceCalculation: null,
  setFormData: (data) => set({ formData: data }),
  setPriceCalculation: (calc) => set({ priceCalculation: calc }),
  clearBooking: () => set({ formData: null, priceCalculation: null }),
}));