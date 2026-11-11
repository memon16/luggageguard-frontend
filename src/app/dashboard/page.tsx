'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://luggageguard-backend-production-efd6.up.railway.app/api';

const VALID_ZIPCODES = [
  '33131','33132','33130','33129','33133','33134','33135','33136','33137','33138',
  '33139','33140','33141','33142','33143','33144','33145','33146','33147','33149',
  '33150','33155','33156','33157','33158','33160','33161','33162','33163','33165',
  '33166','33167','33168','33169','33170','33172','33173','33174','33175','33176',
  '33177','33178','33179','33180','33181','33182','33183','33184','33185','33186',
  '33187','33189','33190','33193','33194','33196',
  '33109','33119','33154','33122','33126','33315','33316',
  '33010','33011','33012','33013','33014','33015','33016','33018',
  '33030','33031','33032','33033','33034','33035',
  '33054','33055','33056','33317','33319','33320','33321','33322','33323','33324','33325',
  '33326','33328','33329','33334','33388',
];

const extractZipCode = (address: string): string | null => {
  const match = address.match(/\b(33\d{3})\b/);
  return match ? match[1] : null;
};

const isValidAddress = (address: string): boolean => {
  const zip = extractZipCode(address);
  return !!zip && VALID_ZIPCODES.includes(zip);
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('hiddenBookings') || '[]');
  });

  // Edit address state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPickup, setEditPickup] = useState('');
  const [editDelivery, setEditDelivery] = useState('');
  const [editError, setEditError] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (!storedUser || !token) { router.push('/auth/login'); return; }
    setUser(JSON.parse(storedUser));
    loadBookings(token);
  }, [router]);

  const loadBookings = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        localStorage.clear();
        router.push('/auth/login');
        return;
      }

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
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (response.ok) setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleHide = (bookingId: string) => {
    const updated = [...hiddenIds, bookingId];
    setHiddenIds(updated);
    localStorage.setItem('hiddenBookings', JSON.stringify(updated));
  };

  const startEdit = (booking: any) => {
    setEditingId(booking.id);
    setEditPickup(booking.pickupAddress);
    setEditDelivery(booking.deliveryAddress);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError('');
  };

  const saveAddress = async (bookingId: string) => {
    const pickup = editPickup.trim();
    const delivery = editDelivery.trim();

    if (!pickup || !delivery) {
      setEditError('Both addresses are required.');
      return;
    }
    if (!isValidAddress(pickup) || !isValidAddress(delivery)) {
      setEditError('Each address must include a valid Miami-area ZIP code (e.g. 1234 Brickell Ave, Miami, FL 33131).');
      return;
    }

    setSavingAddress(true);
    setEditError('');
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/address`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickupAddress: pickup, deliveryAddress: delivery })
      });

      if (response.status === 401) {
        localStorage.clear();
        alert('Your session expired. Please sign in again.');
        router.push('/auth/login');
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not update the address');

      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, pickupAddress: pickup, deliveryAddress: delivery } : b
      ));
      setEditingId(null);
    } catch (err: any) {
      setEditError(err.message || 'Could not update the address');
    } finally {
      setSavingAddress(false);
    }
  };

  const activeBookings = bookings.filter(b => !['DELIVERED', 'CANCELLED'].includes(b.status));
  const historyBookings = bookings
    .filter(b => ['DELIVERED', 'CANCELLED'].includes(b.status))
    .filter(b => !hiddenIds.includes(b.id));

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

  const renderBookingCard = (booking: any) => {
    const isEditing = editingId === booking.id;

    return (
      <div key={booking.id} className="border rounded-xl p-6 hover:shadow-md transition-all">
        <div className="flex justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Booking #{booking.id.slice(0, 8)}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800'}`}>
              {booking.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">${Number(booking.totalPrice).toFixed(2)}</div>
            {booking.payment?.status === 'SUCCEEDED'
              ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">✅ Paid</span>
              : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">⏳ Payment pending</span>
            }
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">📍 Pickup:</p>
            {isEditing ? (
              <input
                type="text"
                value={editPickup}
                onChange={(e) => setEditPickup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{booking.pickupAddress}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">{new Date(booking.pickupDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">🚚 Delivery:</p>
            {isEditing ? (
              <input
                type="text"
                value={editDelivery}
                onChange={(e) => setEditDelivery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{booking.deliveryAddress}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">{new Date(booking.deliveryDate).toLocaleDateString('en-US', {timeZone: 'UTC'})}</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-4">
            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">
                {editError}
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => saveAddress(booking.id)}
                disabled={savingAddress}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold text-sm disabled:opacity-50"
              >
                {savingAddress ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancelEdit}
                disabled={savingAddress}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold text-sm"
              >
                Cancel edit
              </button>
            </div>
          </div>
        )}

        {booking.photoUrl && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-700 mb-2">📸 Your bags at pickup</p>
            <img src={booking.photoUrl} alt="Luggage photo" className="rounded-lg w-full max-h-48 object-cover" />
          </div>
        )}

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>🎒 {booking.numberOfBags} bag(s)</span>
            <span>📅 {booking.storageDays} day(s)</span>
          </div>
          <div className="flex space-x-3">
            {booking.status === 'PENDING' && (
              <>
                {!isEditing && (
                  <button onClick={() => startEdit(booking)} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold text-sm">
                    ✏️ Edit address
                  </button>
                )}
                <button onClick={() => handleCancel(booking.id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-semibold text-sm">
                  Cancel
                </button>
                <button onClick={() => router.push(`/payment/${booking.id}`)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold text-sm">
                  💳 Pay now
                </button>
              </>
            )}
            {['DELIVERED', 'CANCELLED'].includes(booking.status) && (
              <button onClick={() => handleHide(booking.id)} className="text-gray-400 hover:text-red-500 text-sm px-3 py-2 rounded-lg hover:bg-red-50">
                🗑️ Hide
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                : activeBookings.map(b => renderBookingCard(b))
              }
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-4">
              {historyBookings.length === 0
                ? <div className="text-center py-12"><p className="text-gray-600">No history yet</p></div>
                : historyBookings.map(b => renderBookingCard(b))
              }
            </div>
          )}
        </div>
      </div>

      <a
        href="https://wa.me/13058780317?text=Hi! I have a question about my LuggageGuard booking."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all z-50 flex items-center justify-center"
        style={{ width: '60px', height: '60px' }}
      >
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-1.76-.88-2.91-1.566-4.07-3.553-.305-.522.305-.482.875-1.604.097-.198.05-.371-.05-.52-.099-.149-.67-1.612-.917-2.207-.247-.595-.495-.5-.67-.51-.173-.011-.371-.013-.57-.013-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.057 3.146 5.062 4.287 2.555.973 3.052.799 3.6.748.549-.05 1.758-.72 2.006-1.414.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.054 2.284 7.034L.766 23.234a.5.5 0 00.628.628l4.2-1.518A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.156 0-4.16-.622-5.857-1.694l-.395-.248-3.07 1.11 1.124-3.027-.262-.41A9.953 9.953 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
        </svg>
      </a>
    </div>
  );
}