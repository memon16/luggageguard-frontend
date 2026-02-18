// store/useBookingStore.ts
import { create } from 'zustand';
import type { BookingFormData, PriceCalculation } from '@/types';

interface BookingState {
  formData: Partial<BookingFormData>;
  currentStep: number;
  priceCalculation: PriceCalculation | null;
  
  setFormData: (data: Partial<BookingFormData>) => void;
  setStep: (step: number) => void;
  setPriceCalculation: (calc: PriceCalculation) => void;
  resetBooking: () => void;
}

const initialFormData: Partial<BookingFormData> = {
  numberOfBags: 1,
  storageDays: 1,
};

export const useBookingStore = create<BookingState>((set) => ({
  formData: initialFormData,
  currentStep: 1,
  priceCalculation: null,
  
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  
  setStep: (step) => set({ currentStep: step }),
  
  setPriceCalculation: (calc) => set({ priceCalculation: calc }),
  
  resetBooking: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      priceCalculation: null,
    }),
}));
