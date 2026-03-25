'use client';
import Link from 'next/link';
import { Package, Target, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
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

      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">About Us</h1>
        <p className="text-xl text-gray-500 mb-16">Redefining luggage storage for the modern traveler.</p>

        <div className="prose prose-lg text-gray-600 space-y-6 mb-16">
          <p>
            LuggageGuard was born out of a simple frustration: why should travelers be forced to drag their bags around Miami for hours, missing out on the city's best experiences just because their hotel check-in isn't until 3 PM?
          </p>
          <p>
            We started as a local Miami operation with a clear mission — give travelers the freedom to explore the city without the burden of their luggage. No drop-off locations to hunt down. No waiting in lines. Just seamless, door-to-door service that works around your schedule.
          </p>
          <p>
            Today we serve Brickell, South Beach, Downtown Miami, the Port of Miami, Miami International Airport, Fort Lauderdale, and the surrounding areas. We pick up your bags wherever you are, store them securely, and deliver them wherever you need — whether that's your next hotel, your Airbnb, or the cruise terminal.
          </p>
          <p>
            We're just getting started. Our vision goes beyond Miami — we're building a platform that will redefine how travelers manage their luggage across major cities. Fast, reliable, and built with technology at its core.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: <Target className="w-7 h-7" />, title: 'Our Mission', description: 'Give every traveler the freedom to explore without limits — no heavy bags, no wasted time, no compromises.' },
            { icon: <Heart className="w-7 h-7" />, title: 'Our Values', description: 'Reliability, transparency, and genuine care for every customer. We treat your belongings as if they were our own.' },
            { icon: <Zap className="w-7 h-7" />, title: 'Our Vision', description: 'Become the go-to luggage solution for travelers across major U.S. cities, starting right here in Miami.' },
            { icon: <Package className="w-7 h-7" />, title: 'Our Service', description: 'Full door-to-door service — pickup, secure storage, and delivery — all managed through one simple platform.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to travel light?</h2>
          <p className="text-white/90 mb-6">Join hundreds of travelers who've already discovered a better way to explore Miami.</p>
          <Link href="/booking" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}