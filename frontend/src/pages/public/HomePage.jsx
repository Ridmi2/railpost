import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Train, Package, MapPin, Shield, Clock, QrCode,
  Bell, BarChart3, ChevronRight, Search, Phone,
  Mail, Share2, MessageCircle, Heart, Menu, X
} from 'lucide-react';

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#1e3a6e] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <Train size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">RailPost</p>
              <p className="text-blue-300 text-xs">Sri Lanka Railways</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-blue-200 hover:text-white text-sm transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-blue-200 hover:text-white text-sm transition-colors">
              How It Works
            </a>
            <a href="#track" className="text-blue-200 hover:text-white text-sm transition-colors">
              Track Cargo
            </a>
            <a href="#contact" className="text-blue-200 hover:text-white text-sm transition-colors">
              Contact
            </a>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-blue-200 hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium
                         px-4 py-2 rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-blue-200 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#162d56] px-4 py-4 space-y-3 border-t border-blue-800">
          {['#features','#how-it-works','#track','#contact'].map((href, i) => (
            <a
              key={i}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-blue-200 hover:text-white text-sm py-1"
            >
              {['Features','How It Works','Track Cargo','Contact'][i]}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/login"
              className="flex-1 text-center border border-blue-400 text-blue-200
                         py-2 rounded-lg text-sm font-medium">
              Sign In
            </Link>
            <Link to="/signup"
              className="flex-1 text-center bg-blue-500 text-white
                         py-2 rounded-lg text-sm font-medium">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (tracking.trim()) navigate(`/track/${tracking.trim().toUpperCase()}`);
  };

  return (
    <section className="bg-gradient-to-br from-[#1e3a6e] via-[#1a4fa8] to-[#1e3a6e]
                        min-h-[92vh] flex items-center relative overflow-hidden">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div key={i}
            className="absolute border border-white rounded-full"
            style={{
              width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              transform: 'translate(-50%,-50%)'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30
                             text-blue-200 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Sri Lanka Railways — Digital Cargo Service
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Ship Cargo
              <span className="text-blue-400"> Smarter</span>
              <br />Across Sri Lanka
            </h1>

            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-lg">
              Book, track and manage your railway cargo shipments in real time.
              Secure, reliable and transparent — from origin to destination.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400
                           text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
              >
                Book Cargo Now
                <ChevronRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 border border-blue-400 text-blue-200
                           hover:bg-blue-800/50 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '24+',   label: 'Stations'        },
                { value: '150+',  label: 'Daily Shipments' },
                { value: '99.9%', label: 'On-Time Rate'    },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-blue-300 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Track card */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Track Your Cargo</p>
                  <p className="text-blue-200 text-xs">Enter your tracking number</p>
                </div>
              </div>

              <form onSubmit={handleTrack} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={tracking}
                    onChange={e => setTracking(e.target.value)}
                    placeholder="e.g. RP20260527XXXXXX"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                             py-3 rounded-xl transition-colors"
                >
                  Track Now
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-blue-200 text-xs text-center mb-3">Sample status updates</p>
                {[
                  { status: 'Booked',     color: 'bg-blue-500',   time: '09:00 AM' },
                  { status: 'Dispatched', color: 'bg-amber-500',  time: '11:30 AM' },
                  { status: 'In Transit', color: 'bg-violet-500', time: '02:15 PM' },
                  { status: 'Delivered',  color: 'bg-green-500',  time: '05:45 PM' },
                ].map(({ status, color, time }) => (
                  <div key={status} className="flex items-center gap-3 py-1.5">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-white text-xs flex-1">{status}</span>
                    <span className="text-blue-300 text-xs">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Track section (mobile) ─────────────────────────────────────────────────
function TrackSection() {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (tracking.trim()) navigate(`/track/${tracking.trim().toUpperCase()}`);
  };

  return (
    <section id="track" className="bg-[#1e3a6e] py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Track Your Shipment</h2>
        <p className="text-blue-200 text-sm mb-6">
          Enter your tracking number to get real-time status updates
        </p>
        <form onSubmit={handleTrack} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              placeholder="Enter tracking number e.g. RP20260527XXXXXX"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold
                       px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            Track
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Package,   title: 'Online Booking',      color: 'bg-blue-500',
    desc: 'Book cargo from anywhere. Fill in sender, receiver and cargo details online before arriving at the station.' },
  { icon: QrCode,    title: 'QR Code Tracking',    color: 'bg-violet-500',
    desc: 'Each cargo gets a unique QR code. Scan at dispatch, transit and arrival for accurate real-time tracking.' },
  { icon: Bell,      title: 'Instant Notifications', color: 'bg-amber-500',
    desc: 'Get SMS and email alerts at every stage — booked, dispatched, arrived and ready for pickup.' },
  { icon: Shield,    title: 'Secure OTP Delivery',  color: 'bg-emerald-500',
    desc: 'Cargo is released only after the receiver provides a one-time password sent to their mobile.' },
  { icon: Clock,     title: 'Real-Time Status',     color: 'bg-red-500',
    desc: 'View your cargo journey on a live timeline. Know exactly where your shipment is at any moment.' },
  { icon: BarChart3, title: 'Digital Receipts',     color: 'bg-cyan-500',
    desc: 'Automatically generated PDF receipts for every booking and delivery. No more paper forms.' },
];

function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Why RailPost
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Everything You Need
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            A complete digital cargo management system built for Sri Lanka Railways
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100
                         hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center
                              justify-center mb-4`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ───────────────────────────────────────────────────────────
const STEPS = [
  { step: '01', title: 'Register & Book',
    desc: 'Create an account and fill in cargo details including receiver info and destination station online.' },
  { step: '02', title: 'Drop Off at Station',
    desc: 'Bring your cargo to the origin station. The officer weighs it, confirms details and prints your QR label.' },
  { step: '03', title: 'Track in Transit',
    desc: 'Your cargo is scanned at dispatch and every transit point. Track its journey in real time.' },
  { step: '04', title: 'Secure Pickup',
    desc: 'Receiver gets an OTP on their phone. They provide it at the station to collect the cargo safely.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            How It Works
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Ship your cargo in four simple steps
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ step, title, desc }, i) => (
            <div key={step} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full
                                h-0.5 bg-blue-100 z-0" />
              )}
              <div className="relative z-10 inline-flex w-16 h-16 bg-blue-600 rounded-full
                              items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white font-bold text-lg">{step}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ─────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Ship Your Cargo?
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Join thousands of senders who trust RailPost for safe, reliable cargo delivery.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold
                       px-8 py-3 rounded-xl transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="border-2 border-white text-white hover:bg-blue-700
                       font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" className="bg-[#1e3a6e] text-blue-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                <Train size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">RailPost</p>
                <p className="text-blue-300 text-xs">Sri Lanka Railways</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Digital cargo tracking and management system for Sri Lanka Railways.
              Safe, transparent and reliable delivery across the island.
            </p>
            <div className="flex gap-4 mt-4">
              {[Share2, MessageCircle, Heart].map((Icon, i) => (
                <button key={i}
                  className="w-8 h-8 bg-blue-800 hover:bg-blue-600 rounded-lg
                             flex items-center justify-center transition-colors">
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-semibold mb-4">Quick Links</p>
            <div className="space-y-2 text-sm">
              {['Track Cargo', 'Book Cargo', 'Register', 'Sign In'].map(link => (
                <p key={link}>
                  <a href="#" className="hover:text-white transition-colors">{link}</a>
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-4">Contact</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+94 11 232 4215</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>cargo@railway.gov.lk</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>Colombo Fort Station,<br />Colombo 01</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-2 text-xs text-blue-400">
          <p>© 2026 Sri Lanka Railways. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Help & Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrackSection />
      <Features />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  );
}
