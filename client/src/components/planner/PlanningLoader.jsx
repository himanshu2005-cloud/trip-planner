import React from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

export const PLANNING_STEPS = [
  { id: 'attractions', label: 'Finding attractions', desc: 'Querying high-rated places matching your interests' },
  { id: 'clustering', label: 'Grouping nearby places', desc: 'Applying k-means geographic clustering across trip days' },
  { id: 'routing', label: 'Optimizing daily routes', desc: 'Running nearest-neighbour & 2-opt TSP route ordering' },
  { id: 'hours', label: 'Checking opening hours', desc: 'Aligning time windows and dwell durations per stop' },
  { id: 'weather', label: 'Checking weather', desc: 'Validating forecast constraints and outdoor schedules' },
];

export const PlanningLoader = ({ currentStepIndex = 2 }) => {
  return (
    <Card className="p-8 max-w-lg mx-auto text-center border-purple-500/30 shadow-glow relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Animated Icon */}
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-700 to-accent-pink flex items-center justify-center text-white shadow-glow-sm">
        <Sparkles size={24} className="animate-pulse" />
      </div>

      <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-1">
        Creating your itinerary
      </h3>
      <p className="text-xs text-text-muted mb-8 max-w-xs mx-auto">
        Our multi-stage algorithmic engine is organizing your trip
      </p>

      {/* Planning Steps List (DESIGN.md §10) */}
      <div className="flex flex-col gap-3.5 text-left max-w-sm mx-auto">
        {PLANNING_STEPS.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-purple-600/15 border border-purple-500/30 shadow-glow-sm'
                  : 'bg-transparent border border-transparent'
              }`}
            >
              {/* Step Status Indicator (✓, ●, ○) */}
              <div className="mt-0.5 shrink-0 flex items-center justify-center">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-success/20 text-success border border-success/40 flex items-center justify-center text-xs font-bold">
                    <Check size={12} strokeWidth={3} />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-glow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/[0.2] text-text-muted flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/[0.2]" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium transition-colors ${
                    isDone
                      ? 'text-success'
                      : isCurrent
                      ? 'text-purple-300 font-semibold'
                      : 'text-text-muted'
                  }`}
                >
                  {isDone ? `✓ ${step.label}` : isCurrent ? `● ${step.label}` : `○ ${step.label}`}
                </span>
                <span className="text-[11px] text-text-muted mt-0.5">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PlanningLoader;
