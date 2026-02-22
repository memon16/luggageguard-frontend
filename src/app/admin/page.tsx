'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Solo permitir acceso a ADMIN
    if (userData.role !== 'ADMIN') {
      alert('No tienes permisos de administrador');
      router.push('/dashboard');
      return;
    }

    loadAllBookings(token);
  }, [router]);

  const loadAllBookings = async (token: string) => {
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    active: bookings.filter(b => ['CONFIRMED', 'PICKED_UP', 'IN_STORAGE', 'OUT_FOR_DELIVERY'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'DELIVERED').length,
    revenue: bookings.filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + Number(b.totalPrice), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold">LuggageGuard</Link>
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded">ADMIN</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>👤 {user?.firstName}</span>
            <Link href="/dashboard" className="text-gray-300 hover:text-white">Mi Dashboard</Link>
            <button onClick={handleLogout} className="text-gray-300 hover:text-white">Cerrar sesión</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-gray-500 text-sm mb-1">TOTAL</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-yellow-500 text-sm mb-1">PENDIENTES</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-blue-500 text-sm mb-1">ACTIVAS</div>
            <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-green-500 text-sm mb-1">COMPLETADAS</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-purple-500 text-sm mb-1">INGRESOS</div>
            <div className="text-2xl font-bold text-purple-600">${stats.revenue.toFixed(2)}</div>
          </div>
        </div>

        {/* All Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Todas las Reservas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Recogida</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Entrega</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Maletas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Días</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {booking.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-semibold text-gray-900">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </div>
                      <div className="text-gray-500 text-xs">{booking.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{booking.pickupAddress.substring(0, 30)}...</div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{booking.deliveryAddress.substring(0, 30)}...</div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.deliveryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold">
                      {booking.numberOfBags}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-semibold">
                      {booking.storageDays}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ${Number(booking.totalPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}