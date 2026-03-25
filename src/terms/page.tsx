'use client';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="w-7 h-7 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">LuggageGuard</span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">← Back</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-12">Last updated: March 2026</p>

        <div className="space-y-10 text-gray-600">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Service Description</h2>
            <p>LuggageGuard provides luggage pickup, storage, and delivery services in the Miami metropolitan area, including Brickell, South Beach, Downtown Miami, Port of Miami, Miami International Airport (MIA), and Fort Lauderdale-Hollywood International Airport (FLL).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Booking & Payment</h2>
            <p>All bookings must be made through our platform at luggageguard.miami. Payment is required at the time of booking via Stripe. Prices are clearly displayed before confirmation. We accept all major credit and debit cards.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Cancellation Policy</h2>
            <p>Bookings with PENDING status may be cancelled at any time for a full refund. Once a booking is CONFIRMED or in progress, cancellations are subject to review. Please contact us at bookings@luggageguard.miami for assistance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Prohibited Items</h2>
            <p>The following items are strictly prohibited: weapons, illegal substances, perishable food, live animals, hazardous materials, and any items that may pose a safety risk. LuggageGuard reserves the right to refuse storage of any item at its discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Liability</h2>
            <p>LuggageGuard takes reasonable precautions to ensure the safety of stored items. Our liability is limited to the declared value of the items, not to exceed $500 per booking. We strongly recommend removing valuables such as cash, jewelry, and electronics from stored luggage.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Pickup & Delivery</h2>
            <p>We offer pickup and delivery within our service area. The customer is responsible for being available at the scheduled time. If no one is available at pickup time, a rescheduling fee may apply. Delivery times are estimates and may vary due to traffic or other circumstances.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Changes to Terms</h2>
            <p>LuggageGuard reserves the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:bookings@luggageguard.miami" className="text-blue-600 hover:underline">bookings@luggageguard.miami</a> or call <a href="tel:+17868358517" className="text-blue-600 hover:underline">+1 (786) 835-8517</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}