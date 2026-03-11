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

      <div className="flex justify-between items-center">
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>🎒 {booking.numberOfBags} bag(s)</span>
          <span>📅 {booking.storageDays} day(s)</span>
          {booking.specialInstructions && <span>📝 {booking.specialInstructions}</span>}
        </div>
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

        {/* Stats */}
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

        {/* Tabs */}
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

        {/* Active Tab */}
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

        {/* History Tab */}
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
