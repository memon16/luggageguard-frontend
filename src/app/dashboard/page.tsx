'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (!storedUser || !token) { router.push('/auth/login'); return; }
    setUser(JSON.parse(storedUser));
    loadBookings(token);
  }, [router]);

  const loadBookings = async (token: string) => {
    try {
      const response = await fetch('https://luggageguard-backend-production-efd6.up.railway.app/api/bookings', {
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

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://luggageguard-backend-production-efd6.up.railway.app/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (response.ok) setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const activeBookings = bookings.filter(b => !['DELIVERED', 'CANCELLED'].includes(b.status));
  const historyBookings = bookings.filter(b => ['DELIVERED', 'CANCELLED'].includes(b.status));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PICKED_UP: 'bg-purple-100 text-purple-800',
    IN_STORAGE: 'bg-indigo-100 text-indigo-800',
    OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <div className="border rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">Booking #{booking.id.slice(0, 8)}</h3>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800'}`}>
            {booking.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">${Number(booking.totalPrice).toFixed(2)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold mb-1">📍 Pickup:</p>
          <p className="text-gray-600">{booking.pickupAddress}</p>
          <p className="text-gray-500 text-xs">{new Date(booking.pickupDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">🚚 Delivery:</p>
          <p className="text-gray-600">{booking.deliveryAddress}</p>
          <p className="text-gray-500 text-xs">{new Date(booking.deliveryDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>🎒 {booking.numberOfBags} bag(s)</span>
          <span>📅 {booking.storageDays} day(s)</span>
        </div>
        {booking.status === 'PENDING' && (
          <div className="flex space-x-3">
            <button onClick={() => handleCancel(booking.id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-semibold text-sm">
              Cancel
            </button>
            <button onClick={() => router.push(`/payment/${booking.id}`)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold text-sm">
              💳 Pay now
            </button>
          </div>
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
            <span>Hello, {user?.firstName}!</span>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Sign out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-blue-500 text-sm font-semibold mb-2">TOTAL</div>
            <div className="text-3xl font-bold">{bookings.length}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-green-500 text-sm font-semibold mb-2">ACTIVE</div>
            <div className="text-3xl font-bold">{activeBookings.length}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-purple-500 text-sm font-semibold mb-2">COMPLETED</div>
            <div className="text-3xl font-bold">{bookings.filter(b => b.status === 'DELIVERED').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button onClick={() => setTab('active')} className={`px-6 py-3 rounded-lg font-semibold ${tab === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Active ({activeBookings.length})
              </button>
              <button onClick={() => setTab('history')} className={`px-6 py-3 rounded-lg font-semibold ${tab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                History ({historyBookings.length})
              </button>
            </div>
            <Link href="/booking" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">+ New</Link>
          </div>

          {tab === 'active' && (
            <div className="space-y-4">
              {activeBookings.length === 0
                ? <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No active bookings</p>
                    <Link href="/booking" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Create First Booking</Link>
                  </div>
                : activeBookings.map(b => <BookingCard key={b.id} booking={b} />)
              }
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-4">
              {historyBookings.length === 0
                ? <div className="text-center py-12"><p className="text-gray-600">No history yet</p></div>
                : historyBookings.map(b => <BookingCard key={b.id} booking={b} />)
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
