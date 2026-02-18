'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    loadBookings(token);
  }, [router]);

  const loadBookings = async (token: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/bookings', {
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">LuggageGuard</Link>
          <div className="flex items-center space-x-4">
            <span>Hola, {user?.firstName}!</span>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Cerrar sesión</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Mi Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-blue-500 text-sm font-semibold mb-2">TOTAL</div>
            <div className="text-3xl font-bold">{bookings.length}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-green-500 text-sm font-semibold mb-2">ACTIVAS</div>
            <div className="text-3xl font-bold">{bookings.filter(b => !['DELIVERED', 'CANCELLED'].includes(b.status)).length}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-purple-500 text-sm font-semibold mb-2">COMPLETADAS</div>
            <div className="text-3xl font-bold">{bookings.filter(b => b.status === 'DELIVERED').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mis Reservas</h2>
            <Link href="/booking" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">+ Nueva</Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Aún no tienes reservas</p>
              <Link href="/booking" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">Crear Primera Reserva</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="border rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Reserva #{booking.id.slice(0, 8)}</h3>
                      <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{booking.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">${Number(booking.totalPrice).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">📍 Recogida:</p>
                      <p className="text-gray-600">{booking.pickupAddress}</p>
                      <p className="text-gray-500 text-xs">{new Date(booking.pickupDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🚚 Entrega:</p>
                      <p className="text-gray-600">{booking.deliveryAddress}</p>
                      <p className="text-gray-500 text-xs">{new Date(booking.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex space-x-4 text-sm text-gray-600">
                    <span>🎒 {booking.numberOfBags} maleta(s)</span>
                    <span>📅 {booking.storageDays} día(s)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}