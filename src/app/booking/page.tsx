'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookingData {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupDate: string;
  pickupTimeSlot: string;
  numberOfBags: number | string;
  storageDays: number | string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  specialInstructions: string;
}

const VALID_ZIPCODES = [
  '33131','33132','33130','33129','33133','33134','33135','33136','33137','33138',
  '33139','33140','33141','33142','33143','33144','33145','33146','33147','33149',
  '33150','33155','33156','33157','33158','33160','33161','33162','33163','33165',
  '33166','33167','33168','33169','33170','33172','33173','33174','33175','33176',
  '33177','33178','33179','33180','33181','33182','33183','33184','33185','33186',
  '33187','33189','33190','33193','33194','33196',
  '33109','33119','33154',
  '33010','33011','33012','33013','33014','33015','33016','33018',
  '33030','33031','33032','33033','33034','33035',
  '33054','33055','33056'
];

const extractZipCode = (address: string): string | null => {
  const match = address.match(/\b(33\d{3})\b/);
  return match ? match[1] : null;
};

const isValidZipCode = (address: string): boolean => {
  const zip = extractZipCode(address);
  if (!zip) return false; // Ahora SÍ bloqueamos si no hay ZIP
  return VALID_ZIPCODES.includes(zip);
};

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<BookingData>({
    pickupAddress: '',
    pickupLat: 25.7617,
    pickupLng: -80.1918,
    pickupDate: '',
    pickupTimeSlot: '09:00-12:00',
    numberOfBags: 1,
    storageDays: 1,
    deliveryAddress: '',
    deliveryLat: 25.7617,
    deliveryLng: -80.1918,
    deliveryDate: '',
    deliveryTimeSlot: '09:00-12:00',
    specialInstructions: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) router.push('/auth/login');
  }, [router]);

  const calculatePrice = () => {
  const bags = Number(formData.numberOfBags) || 1;
  const days = Number(formData.storageDays) || 1;
  const basePrice = 15 * bags;
  const storagePrice = 8 * bags * days;
  let total = basePrice + storagePrice;
  let discount = 0;
  if (days >= 7) discount = total * 0.15;
  else if (days >= 3) discount = total * 0.10;
  if (bags >= 3) discount += total * 0.05;
  total -= discount;
  return { basePrice, storagePrice, discount, total: Math.max(total, 0) };
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === 'numberOfBags' || name === 'storageDays' 
      ? (value === '' ? '' : parseInt(value) || 1)
      : value
  }));
};

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://luggageguard-backend-production-efd6.up.railway.app/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          pickupDate: new Date(formData.pickupDate).toISOString(),
          deliveryDate: new Date(formData.deliveryDate).toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error creating booking');
      alert('Booking created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  const pricing = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">LuggageGuard</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">← Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">New Booking</h1>

        <div className="mb-8 flex items-center justify-center space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{s}</div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="bg-white rounded-lg shadow-lg p-8">

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pickup Information</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Address</label>
                <input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 Brickell Ave, Miami, FL 33131" required />
                <p className="text-xs text-gray-400 mt-1">Include your ZIP code — we service Miami, Brickell, South Beach and surroundings.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Date</label>
                  <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                  <select name="pickupTimeSlot" value={formData.pickupTimeSlot} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="09:00-12:00">9:00 AM - 12:00 PM</option>
                    <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                    <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Bags</label>
                <input type="number" name="numberOfBags" value={formData.numberOfBags} onChange={handleChange}
                  min="1" max="10" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <button
                onClick={() => {
                  if (!isValidZipCode(formData.pickupAddress)) {
                    setError('Sorry, we currently only service the Miami area (Brickell, South Beach and surroundings). Please include a valid Miami ZIP code in your address.');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                disabled={!formData.pickupAddress || !formData.pickupDate}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                Next: Delivery →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Information</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Storage Days</label>
                <input type="number" name="storageDays" value={formData.storageDays} onChange={handleChange}
                  min="1" max="30" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <p className="text-sm text-gray-500 mt-1">Discount: 3-6 days (10%), 7+ days (15%)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5678 Ocean Dr, Miami Beach, FL 33139" required />
                <p className="text-xs text-gray-400 mt-1">Include your ZIP code — we service Miami, Brickell, South Beach and surroundings.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Date</label>
                  <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange}
                    min={formData.pickupDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                  <select name="deliveryTimeSlot" value={formData.deliveryTimeSlot} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="09:00-12:00">9:00 AM - 12:00 PM</option>
                    <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                    <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">← Back</button>
                <button
                  onClick={() => {
                    if (!isValidZipCode(formData.deliveryAddress)) {
                      setError('Sorry, we currently only service the Miami area (Brickell, South Beach and surroundings). Please include a valid Miami ZIP code in your address.');
                      return;
                    }
                    setError('');
                    setStep(3);
                  }}
                  disabled={!formData.deliveryAddress || !formData.deliveryDate}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  Next: Review →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Summary</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Pickup</h3>
                  <p className="text-gray-600">{formData.pickupAddress}</p>
                  <p className="text-gray-600">{formData.pickupDate} • {formData.pickupTimeSlot}</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Storage</h3>
                  <p className="text-gray-600">{formData.numberOfBags} bag(s) • {formData.storageDays} day(s)</p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery</h3>
                  <p className="text-gray-600">{formData.deliveryAddress}</p>
                  <p className="text-gray-600">{formData.deliveryDate} • {formData.deliveryTimeSlot}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 space-y-2">
                <div className="flex justify-between"><span className="text-gray-700">Base Price:</span><span className="font-semibold">${pricing.basePrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-700">Storage:</span><span className="font-semibold">${pricing.storagePrice.toFixed(2)}</span></div>
                {pricing.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span className="font-semibold">-${pricing.discount.toFixed(2)}</span></div>}
                <div className="border-t border-blue-200 pt-2 flex justify-between text-lg"><span className="font-bold text-gray-900">TOTAL:</span><span className="font-bold text-blue-600">${pricing.total.toFixed(2)}</span></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions (Optional)</label>
                <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange}
                  rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Call upon arrival, gate code, etc." />
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">← Back</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50">
                  {loading ? 'Creating...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
