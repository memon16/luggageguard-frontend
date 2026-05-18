'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://luggageguard-backend-production-efd6.up.railway.app/api';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_STORAGE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PICKED_UP: 'bg-purple-100 text-purple-800',
  IN_STORAGE: 'bg-indigo-100 text-indigo-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [tab, setTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (!user || !token) { router.push('/auth/login'); return; }
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== 'ADMIN') { router.push('/dashboard'); return; }
    loadBookings(token);
  }, []);

  const loadBookings = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setBookings(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const printLabel = async (booking: any) => {
    const QRCode = (await import('qrcode')).default;
    const qrDataUrl = await QRCode.toDataURL(
      `https://luggageguard.miami/admin?booking=${booking.id}`,
      { width: 150, margin: 1 }
    );

    const labelWindow = window.open('', '_blank');
    if (!labelWindow) return;

    labelWindow.document.write(`
      <html>
      <head>
        <title>LuggageGuard Label - ${booking.id.slice(0, 8).toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .label { border: 2px solid black; border-radius: 8px; padding: 16px; max-width: 400px; margin: 0 auto; }
          .header { background: #2563eb; color: white; padding: 10px; border-radius: 6px; text-align: center; margin-bottom: 12px; }
          .header h1 { margin: 0; font-size: 20px; }
          .booking-id { font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 3px; margin: 10px 0; }
          .section { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .label-text { font-size: 11px; color: #666; margin: 0; }
          .value { font-size: 13px; font-weight: bold; margin: 2px 0 0; }
          .qr-section { text-align: center; margin-top: 12px; }
          .footer { text-align: center; font-size: 10px; color: #999; margin-top: 8px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body onload="window.print()">
        <div class="label">
          <div class="header">
            <h1>LuggageGuard 🧳</h1>
          </div>
          <div class="booking-id">#${booking.id.slice(0, 8).toUpperCase()}</div>
          <div class="section">
            <p class="label-text">CUSTOMER</p>
            <p class="value">${booking.user?.firstName} ${booking.user?.lastName}</p>
            <p class="value" style="font-weight: normal; font-size: 12px;">${booking.user?.phone || ''}</p>
          </div>
          <div class="section">
            <p class="label-text">PICKUP</p>
            <p class="value">${booking.pickupAddress}</p>
            <p class="value" style="font-weight: normal;">${new Date(booking.pickupDate).toLocaleDateString()} • ${booking.pickupTimeSlot}</p>
          </div>
          <div class="section">
            <p class="label-text">DELIVERY</p>
            <p class="value">${booking.deliveryAddress}</p>
            <p class="value" style="font-weight: normal;">${new Date(booking.deliveryDate).toLocaleDateString()} • ${booking.deliveryTimeSlot}</p>
          </div>
          <div class="section">
            <p class="label-text">BAGS / DAYS</p>
            <p class="value">${booking.numberOfBags} bag(s) • ${booking.storageDays} day(s)</p>
          </div>
          <div class="qr-section">
            <img src="${qrDataUrl}" alt="QR Code" />
            <p class="footer">Scan to view booking details</p>
          </div>
          <div class="footer">luggageguard.miami • +1 (305) 878-0317</div>
        </div>
      </body>
      </html>
    `);
    labelWindow.document.close();
  };

  const activeBookings = bookings.filter(b => !['DELIVERED', 'CANCELLED'].includes(b.status));
  const historyBookings = bookings.filter(b => ['DELIVERED', 'CANCELLED'].includes(b.status));
  const filteredActive = filter === 'ALL' ? activeBookings : activeBookings.filter(b => b.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const BookingCard = ({ booking }: { booking: any }) => (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-lg font-mono">#{booking.id.slice(0, 8).toUpperCase()}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[booking.status]}`}>
              {booking.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {booking.user?.firstName} {booking.user?.lastName} — {booking.user?.email} — 📞 {booking.user?.phone || 'No phone'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">${Number(booking.totalPrice).toFixed(2)}</div>
          <div className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-semibold mb-1">📍 Pickup</p>
          <p className="text-gray-600">{booking.pickupAddress}</p>
          <p className="text-gray-500 text-xs">{new Date(booking.pickupDate).toLocaleDateString()} • {booking.pickupTimeSlot}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-semibold mb-1">🚚 Delivery</p>
          <p className="text-gray-600">{booking.deliveryAddress}</p>
          <p className="text-gray-500 text-xs">{new Date(booking.deliveryDate).toLocaleDateString()} • {booking.deliveryTimeSlot}</p>
        </div>
      </div>

      {booking.specialInstructions && (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800 mb-4">
          📝 <strong>Instructions:</strong> {booking.specialInstructions}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>🎒 {booking.numberOfBags} bag(s)</span>
          <span>📅 {booking.storageDays} day(s)</span>
        </div>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => printLabel(booking)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold text-sm"
          >
            🖨️ Print Label
          </button>
          {!['DELIVERED', 'CANCELLED'].includes(booking.status) && (
            <select
              value={booking.status}
              onChange={(e) => updateStatus(booking.id, e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_FLOW.filter(s => s !== 'CANCELLED').map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">LuggageGuard</Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">ADMIN</span>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Customer View</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Operations Panel</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['PENDING', 'CONFIRMED', 'IN_STORAGE', 'OUT_FOR_DELIVERY'].map(status => (
            <div key={status} className="bg-white rounded-lg p-4 shadow">
              <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${STATUS_COLORS[status]}`}>
                {status.replace(/_/g, ' ')}
              </div>
              <div className="text-2xl font-bold mt-2">{bookings.filter(b => b.status === status).length}</div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setTab('active')}
            className={`px-6 py-3 rounded-lg font-semibold ${tab === 'active' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Active ({activeBookings.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-6 py-3 rounded-lg font-semibold ${tab === 'history' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            History ({historyBookings.length})
          </button>
        </div>

        {tab === 'active' && (
          <>
            <div className="flex space-x-2 mb-6 flex-wrap gap-2">
              {['ALL', 'PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_STORAGE', 'OUT_FOR_DELIVERY'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === s ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {filteredActive.length === 0
                ? <div className="bg-white rounded-lg p-8 text-center text-gray-500">No active bookings</div>
                : filteredActive.map(b => <BookingCard key={b.id} booking={b} />)
              }
            </div>
          </>
        )}

        {tab === 'history' && (
          <div className="space-y-4">
            {historyBookings.length === 0
              ? <div className="bg-white rounded-lg p-8 text-center text-gray-500">No history yet</div>
              : historyBookings.map(b => <BookingCard key={b.id} booking={b} />)
            }
          </div>
        )}
      </div>
    </div>
  );
}