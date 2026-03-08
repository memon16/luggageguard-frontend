'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://luggageguard-backend-production-efd6.up.railway.app/api';

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bookingId = params.id;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    loadBooking(token);
  }, []);

  const loadBooking = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setBooking(data.data);
      else router.push('/dashboard');
    } catch (error) {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setError('');
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId })
      });
      const data = await response.json();
      if (response.ok) {
        router.push('/dashboard?success=true');
      } else {
        setError(data.message || 'Error procesando el pago');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center">Reserva no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">LuggageGuard</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">← Volver al Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Completar Pago</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Resumen de Reserva</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Reserva #</span>
              <span className="font-semibold">{booking.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">📍 Recogida</span>
              <span>{booking.pickupAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🚚 Entrega</span>
              <span>{booking.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">🎒 Maletas</span>
              <span>{booking.numberOfBags}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">📅 Días</span>
              <span>{booking.storageDays}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">${Number(booking.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">💳 Información de Pago</h2>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Juan García" required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} placeholder="4242 4242 4242 4242" required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">Para pruebas usa: 4242 4242 4242 4242</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/AA" required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" required className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={paying} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 mt-4">
              {paying ? 'Procesando...' : `Pagar $${Number(booking.totalPrice).toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}