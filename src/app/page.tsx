// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  Package,
  Truck,
  CheckCircle,
  Star,
  Menu,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-display font-bold gradient-text">
                LuggageGuard
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-neutral-700 hover:text-primary-500 transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-neutral-700 hover:text-primary-500 transition-colors">
                Pricing
              </Link>
              <Link href="#features" className="text-neutral-700 hover:text-primary-500 transition-colors">
                Features
              </Link>
              <Link href="/auth/login" className="text-neutral-700 hover:text-primary-500 transition-colors">
                Login
              </Link>
              <Link 
                href="/booking" 
                className="bg-primary-500 text-white px-6 py-2.5 rounded-lg hover:bg-primary-600 transition-all transform hover:scale-105 shadow-md"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-gray-200 animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <Link href="#how-it-works" className="block text-neutral-700 hover:text-primary-500 transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="block text-neutral-700 hover:text-primary-500 transition-colors">
                Pricing
              </Link>
              <Link href="#features" className="block text-neutral-700 hover:text-primary-500 transition-colors">
                Features
              </Link>
              <Link href="/auth/login" className="block text-neutral-700 hover:text-primary-500 transition-colors">
                Login
              </Link>
              <Link 
                href="/booking" 
                className="block bg-primary-500 text-white px-6 py-2.5 rounded-lg hover:bg-primary-600 transition-all text-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-900 mb-6 leading-tight">
                Store Your <span className="gradient-text">Luggage</span> Safely in Miami
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Say goodbye to luggage worries. We pick up, store securely, and deliver your bags wherever you need in Miami Brickell.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/booking"
                  className="bg-primary-500 text-white px-8 py-4 rounded-xl hover:bg-primary-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <span>Book Storage Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="#how-it-works"
                  className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-xl hover:bg-primary-50 transition-all flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <span>Learn More</span>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-700">Insured Storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-700">24/7 Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-700">Same-Day Service</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-slide-up">
              <div className="bg-gradient-to-br from-primary-400 to-indigo-600 rounded-3xl p-8 shadow-strong transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-8 transform -rotate-3">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Free Pickup</h3>
                        <p className="text-neutral-600 text-sm">We come to you anywhere in Brickell</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Secure Storage</h3>
                        <p className="text-neutral-600 text-sm">Climate-controlled facility</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Truck className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">Fast Delivery</h3>
                        <p className="text-neutral-600 text-sm">Get your bags when you need them</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Three simple steps to worry-free luggage storage
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: <Clock className="w-8 h-8" />,
                title: 'Book Pickup',
                description: 'Choose your pickup time and location through our easy-to-use app',
                color: 'bg-blue-500',
              },
              {
                step: '2',
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Secure Storage',
                description: 'Your luggage is stored in our secure, monitored facility',
                color: 'bg-purple-500',
              },
              {
                step: '3',
                icon: <Truck className="w-8 h-8" />,
                title: 'Get Delivery',
                description: 'We deliver your bags to your chosen location at your convenience',
                color: 'bg-green-500',
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-medium hover:shadow-strong transition-all card-hover border border-gray-100"
              >
                <div className={`${item.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
                  {item.icon}
                </div>
                <div className="absolute top-6 right-6 text-6xl font-bold text-neutral-100">
                  {item.step}
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-primary-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              No hidden fees. Pay only for what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-medium border-2 border-transparent hover:border-primary-500 transition-all">
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4">
                Storage Fees
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-neutral-700">Base price per bag</span>
                  <span className="text-2xl font-bold text-primary-500">$15</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-neutral-700">Per day per bag</span>
                  <span className="text-2xl font-bold text-primary-500">$8</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-700">Pickup & delivery</span>
                  <span className="text-2xl font-bold text-green-500">FREE</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl p-8 shadow-strong text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-display font-bold">
                  Save More
                </h3>
                <Star className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span>3-6 days storage</span>
                  <span className="text-2xl font-bold">10% off</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span>7+ days storage</span>
                  <span className="text-2xl font-bold">15% off</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span>3+ bags</span>
                  <span className="text-2xl font-bold">5% off</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/booking"
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-8 py-4 rounded-xl hover:bg-primary-600 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              <span>Calculate Your Price</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              Why Choose LuggageGuard?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Premium service with unmatched convenience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Fully Insured',
                description: 'All luggage is covered by comprehensive insurance',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: '24/7 Service',
                description: 'Book pickup and delivery anytime, day or night',
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: 'Convenient Locations',
                description: 'Serving all of Miami Brickell area',
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: 'Secure Payments',
                description: 'Encrypted transactions with Stripe',
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: 'Real-Time Tracking',
                description: 'Know exactly where your luggage is at all times',
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Satisfaction Guaranteed',
                description: 'We promise exceptional service or your money back',
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-neutral-50 rounded-xl p-6 hover:bg-white hover:shadow-medium transition-all card-hover"
              >
                <div className="bg-primary-500 text-white w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Travel Light?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your luggage storage in under 2 minutes. Experience the freedom of traveling without bags.
          </p>
          <Link 
            href="/booking"
            className="inline-flex items-center space-x-2 bg-white text-primary-500 px-8 py-4 rounded-xl hover:bg-neutral-50 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-display font-bold">LuggageGuard</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Secure luggage storage and delivery in Miami Brickell.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/insurance" className="hover:text-white transition-colors">Insurance Info</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>support@luggageguard.com</li>
                <li>+1 (305) 555-0123</li>
                <li>Miami, FL 33131</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2026 LuggageGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
