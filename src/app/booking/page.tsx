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
  numberOfBags: number;
  storageDays: number;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  specialInstructions: string;
}

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
    // Verificar autenticación
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const calculatePrice = () => {
    const basePrice = 15 * formData.numberOfBags;
    const storagePrice = 8 * formData.numberOfBags * formData.storageDays;
    let total = basePrice + storagePrice;
    
    // Descuento por días
    let discount = 0;
    if (formData.storageDays >= 7) {
      discount = total * 0.15;
    } else if (formData.storageDays >= 3) {
      discount = total * 0.10;
    }
    
    // Descuento por maletas
    if (formData.numberOfBags >= 3) {
      discount += total * 0.05;
    }
    
    total -= discount;
    
    return {
      basePrice,
      storagePrice,
      discount,
      total: Math.max(total, 0)
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfBags' || name === 'storageDays' 
        ? parseInt(value) || 1 
        : value
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('http://https://luggageguard-backend-production-efd6.up.railway.app/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          pickupDate: new Date(formData.pickupDate).toISOString(),
          deliveryDate: new Date(formData.deliveryDate).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la reserva');
      }

      // Redirigir al dashboard
      alert('¡Reserva creada exitosamente!');
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const pricing = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LuggageGuard
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Volver al Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Nueva Reserva
        </h1>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* STEP 1: Pickup */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información de Recogida
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección de Recogida
                </label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 Brickell Ave, Miami, FL"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Recogida
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horario
                  </label>
                  <select
                    name="pickupTimeSlot"
                    value={formData.pickupTimeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="09:00-12:00">9:00 AM - 12:00 PM</option>
                    <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                    <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Maletas
                </label>
                <input
                  type="number"
                  name="numberOfBags"
                  value={formData.numberOfBags}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.pickupAddress || !formData.pickupDate}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                Siguiente: Entrega
              </button>
            </div>
          )}

          {/* STEP 2: Delivery */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información de Entrega
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Días de Almacenamiento
                </label>
                <input
                  type="number"
                  name="storageDays"
                  value={formData.storageDays}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Descuento: 3-6 días (10%), 7+ días (15%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5678 Ocean Dr, Miami Beach, FL"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    min={formData.pickupDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horario
                  </label>
                  <select
                    name="deliveryTimeSlot"
                    value={formData.deliveryTimeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="09:00-12:00">9:00 AM - 12:00 PM</option>
                    <option value="12:00-15:00">12:00 PM - 3:00 PM</option>
                    <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.deliveryAddress || !formData.deliveryDate}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  Siguiente: Resumen
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Resumen de Reserva
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Recogida</h3>
                  <p className="text-gray-600">{formData.pickupAddress}</p>
                  <p className="text-gray-600">{formData.pickupDate} • {formData.pickupTimeSlot}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Almacenamiento</h3>
                  <p className="text-gray-600">{formData.numberOfBags} maleta(s) • {formData.storageDays} día(s)</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Entrega</h3>
                  <p className="text-gray-600">{formData.deliveryAddress}</p>
                  <p className="text-gray-600">{formData.deliveryDate} • {formData.deliveryTimeSlot}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 rounded-lg p-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Precio Base:</span>
                  <span className="font-semibold">${pricing.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Almacenamiento:</span>
                  <span className="font-semibold">${pricing.storagePrice.toFixed(2)}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span className="font-semibold">-${pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-2 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">TOTAL:</span>
                  <span className="font-bold text-blue-600">${pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instrucciones Especiales (Opcional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Llamar al llegar, código de entrada, etc."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}