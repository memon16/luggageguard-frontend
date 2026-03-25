'use client';
import Link from 'next/link';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="w-7 h-7 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">LuggageGuard</span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">← Back</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-500 mb-12">We're here to help. Reach out anytime.</p>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-md flex items-center space-x-6">
            <div className="bg-blue-500 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">PHONE / WHATSAPP</p>
              <a href="tel:+17868358517" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                +1 (786) 835-8517
              </a>
              <p className="text-gray-500 text-sm mt-1">Available 7 days a week</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md flex items-center space-x-6">
            <div className="bg-blue-500 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">EMAIL</p>
              <a href="mailto:bookings@luggageguard.miami" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                bookings@luggageguard.miami
              </a>
              <p className="text-gray-500 text-sm mt-1">We respond within a few hours</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md flex items-center space-x-6">
            <div className="bg-blue-500 text-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">SERVICE AREA</p>
              <p className="text-2xl font-bold text-gray-900">Miami, FL</p>
              <p className="text-gray-500 text-sm mt-1">Brickell · South Beach · Downtown · Port of Miami · MIA · FLL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}