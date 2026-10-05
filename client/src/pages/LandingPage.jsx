import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Route,
  CloudRain,
  ShieldCheck,
  Star,
  Clock,
  IndianRupee,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export const LandingPage = () => {
  return (
    <div className="flex flex-col gap-20 py-8 animate-fade-in">
      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow-sm">
          <Sparkles size={14} className="text-purple-400" />
          <span>Algorithmic Travel Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-text-primary mb-6 leading-tight">
          Plan less.{' '}
          <span className="bg-gradient-to-r from-purple-400 via-accent-pink to-accent-blue bg-clip-text text-transparent">
            Explore more.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mb-8 leading-relaxed">
          Build smarter day-by-day itineraries optimized around your time, budget,
          interests, and travel distance with k-means clustering and 2-opt route ordering.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/plan">
            <Button size="lg" variant="primary">
              <span>Create My Itinerary</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="secondary">
              <span>Explore How It Works</span>
            </Button>
          </a>
        </div>
      </section>

      {/* ── Hero Preview Card (DESIGN.md §8: preview card instead of generic stock image) ── */}
      <section className="max-w-4xl mx-auto w-full">
        <Card className="p-6 sm:p-8 border-purple-500/30 shadow-glow relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
            <div>
              <Badge variant="purple" className="mb-2">Demo Itinerary</Badge>
              <h3 className="text-2xl font-bold text-text-primary">Paris, France</h3>
              <p className="text-xs text-text-muted mt-1">
                5 Days · ₹40,000 Budget · 18 Curated Places
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-success bg-success/10 border border-success/30 px-3 py-1.5 rounded-xl">
                ✓ Route Optimized (-38% travel time)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs text-purple-400 mb-1 font-semibold">
                <span>09:00 AM</span>
                <span className="flex items-center gap-1 text-warning">
                  <Star size={11} className="fill-warning" /> 4.8
                </span>
              </div>
              <h5 className="font-semibold text-text-primary text-sm">Louvre Museum</h5>
              <div className="flex items-center justify-between text-xs text-text-muted mt-2">
                <span>2h 30m</span>
                <span>₹1,800</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs text-purple-400 mb-1 font-semibold">
                <span>12:00 PM</span>
                <span className="flex items-center gap-1 text-warning">
                  <Star size={11} className="fill-warning" /> 4.7
                </span>
              </div>
              <h5 className="font-semibold text-text-primary text-sm">Café de Flore Lunch</h5>
              <div className="flex items-center justify-between text-xs text-text-muted mt-2">
                <span>1h 15m</span>
                <span>₹950</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs text-purple-400 mb-1 font-semibold">
                <span>02:00 PM</span>
                <span className="flex items-center gap-1 text-warning">
                  <Star size={11} className="fill-warning" /> 4.9
                </span>
              </div>
              <h5 className="font-semibold text-text-primary text-sm">Notre-Dame Cathedral</h5>
              <div className="flex items-center justify-between text-xs text-text-muted mt-2">
                <span>1h 30m</span>
                <span className="text-success font-medium">Free</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Algorithm Features Section ───────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-6xl mx-auto w-full pt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">
            Built with Mathematical Optimization
          </h2>
          <p className="text-sm text-text-muted mt-2 max-w-xl mx-auto">
            Not a generic wrapper. Every day is clustered, ordered, and constrained
            using specialized algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:border-purple-500/40">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
              <Layers size={20} />
            </div>
            <h4 className="text-base font-semibold text-text-primary mb-2">
              Geographic Clustering
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              K-means clustering groups attractions into coherent geographic zones,
              preventing zigzagging across the city on any single day.
            </p>
          </Card>

          <Card className="p-6 hover:border-purple-500/40">
            <div className="w-10 h-10 rounded-xl bg-accent-pink/20 text-accent-pink flex items-center justify-center mb-4">
              <Route size={20} />
            </div>
            <h4 className="text-base font-semibold text-text-primary mb-2">
              TSP 2-Opt Optimization
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Combines nearest-neighbour heuristics with 2-opt edge-swapping to
              uncross inefficient paths and minimize daily commute times.
            </p>
          </Card>

          <Card className="p-6 hover:border-purple-500/40">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center mb-4">
              <CloudRain size={20} />
            </div>
            <h4 className="text-base font-semibold text-text-primary mb-2">
              Adaptive Constraints
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Real-time awareness of attraction opening hours, strict daily budgets,
              and weather forecasts to ensure feasible journeys.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
