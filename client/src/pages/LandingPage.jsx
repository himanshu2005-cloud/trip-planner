import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  MapPin,
  Calendar,
  Wallet,
  Star,
  Globe,
  Plane,
  Building2,
  Car,
  TrendingUp
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [activeTab, setActiveTab] = useState('holidays');

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      navigate('/plan', { state: { destination } });
    } else {
      navigate('/plan');
    }
  };

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'holidays', label: 'Holiday Packages', icon: Compass },
    { id: 'cabs', label: 'Cabs', icon: Car },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── MMT Style Hero & Search ────────────────────────────────────────── */}
      <section className="relative pt-28 pb-32 px-4 bg-purple-900 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
          <div className="absolute top-20 -right-20 w-[30rem] h-[30rem] bg-accent-pink rounded-full mix-blend-screen filter blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-10 tracking-tight">
            Discover Your Next Great Adventure
          </h1>

          {/* Search Widget Card */}
          <Card className="bg-surface p-2 rounded-2xl shadow-xl mx-auto max-w-4xl border-none">
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar border-b border-glass-border mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-text-secondary hover:text-purple-500'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" size={20} />
                  <input
                    type="text"
                    placeholder="e.g. Paris, Jaipur, Tokyo"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-background border border-glass-border text-text-primary rounded-xl py-4 pl-10 pr-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-semibold text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted mb-1 uppercase tracking-wider">Duration</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <select className="w-full bg-background border border-glass-border text-text-primary rounded-xl py-4 pl-10 pr-4 outline-none appearance-none font-semibold text-lg">
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">1 Week</option>
                  </select>
                </div>
              </div>

              <Button type="submit" size="lg" variant="primary" className="bg-purple-600 hover:bg-purple-700 py-4 h-full text-lg w-full">
                SEARCH
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* ── Trending Destinations ────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-background max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="text-purple-500" size={24} />
          <h2 className="text-2xl font-bold text-text-primary">Trending Holiday Destinations</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602881469-447844698544?q=80&w=600&auto=format&fit=crop', desc: 'City of Lights' },
            { name: 'Jaipur', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop', desc: 'The Pink City' },
            { name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop', desc: 'Neon & Tradition' },
            { name: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e2815cb?q=80&w=600&auto=format&fit=crop', desc: 'The Concrete Jungle' },
          ].map((dest, i) => (
            <div key={i} onClick={() => navigate('/plan', { state: { destination: dest.name } })} className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-[3/4] shadow-md">
              <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                <p className="text-sm text-gray-300 font-medium">{dest.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-background-secondary w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-12">Why Book With TripPilot?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-none shadow-sm">
              <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto flex items-center justify-center mb-6">
                <Globe size={32} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-3">AI-Powered Routing</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our mathematical engine clusters and orders attractions using K-means and 2-opt, saving you hours of transit time.
              </p>
            </Card>

            <Card className="p-8 text-center border-none shadow-sm">
              <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto flex items-center justify-center mb-6">
                <Wallet size={32} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-3">Budget Aware</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Strict adherence to your predefined budgets, estimating costs for food, activities, and local transport accurately.
              </p>
            </Card>

            <Card className="p-8 text-center border-none shadow-sm">
              <div className="w-16 h-16 rounded-full bg-purple-100 mx-auto flex items-center justify-center mb-6">
                <Star size={32} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-3">Curated Experiences</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                We automatically filter out low-rated tourist traps, only keeping highly reviewed spots tailored to your interests.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary mb-6">Ready to plan your next holiday?</h2>
        <p className="text-text-secondary mb-8">Join thousands of travelers using TripPilot to organize their journeys effortlessly.</p>
        <Link to="/plan">
          <Button size="lg" variant="primary" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg">
            Start Planning Now
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default LandingPage;
