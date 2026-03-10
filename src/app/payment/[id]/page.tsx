'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_URL = 'https://luggageguard-backend-production-efd6.up.railway.app/api';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function CheckoutForm({ booking, bookingId }: { booking: any; bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError('');
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error creating payment');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: elements.getElement(CardElement)! } }
      );

      if (stripeError) { setError(stripeError.message || 'Payment error'); return; }

      if (paymentIntent?.status === 'succeeded') {
        await fetch(`${API_URL}/payments/confirm`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, bookingId })
        });
        router.push('/dashboard?success=true');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card details</label>
        <div className="border rounded-lg px-4 py-4 focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#374151' } } }} />
        </div>
      </div>
      <button type="submit" disabled={paying || !stripe} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 mt-4">
        {paying ? 'Processing...' : `Pay $${Number(booking.totalPrice).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bookingId = params.id;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/auth/login'); return; }
    fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (data.data) setBooking(data.data); else router.push('/dashboard'); })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center">Booking not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">LuggageGuard</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">← Back to Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Booking #</span><span className="font-semibold">{booking.id.slice(0, 8)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">📍 Pickup</span><span>{booking.pickupAddress}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">🚚 Delivery</span><span>{booking.deliveryAddress}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">🎒 Bags</span><span>{booking.numberOfBags}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">📅 Days</span><span>{booking.storageDays}</span></div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span><span className="text-blue-600">${Number(booking.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">💳 Payment Information</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm booking={booking} bookingId={bookingId} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
