import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import Card from '../ui/Card';

export const PLANNING_STEPS = [
  { id: 'attractions', label: 'Finding attractions' },
  { id: 'clustering', label: 'Grouping nearby places' },
  { id: 'routing', label: 'Optimizing daily routes' },
  { id: 'hours', label: 'Checking opening hours' },
  { id: 'weather', label: 'Checking weather constraints' },
];

export const PlanningLoader = ({ currentStepIndex = 2 }) => {
  return (
    <Card className="p-8 max-w-md mx-auto text-center border-purple-500/20 shadow-glow">
      <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
        <Loader2 size={24} className="animate-spin" />
      </div>

      <h3 className="text-xl font-semibold text-text-primary mb-1">
        Creating your itinerary
      </h3>
      <p className="text-xs text-text-muted mb-6">
        Our multi-stage optimization engine is structuring your journey
      </p>

      <div className="flex flex-col gap-3 text-left">
        {PLANNING_STEPS.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-sm transition-colors ${
                isDone
                  ? 'text-success font-medium'
                  : isCurrent
                  ? 'text-purple-300 font-medium'
                  : 'text-text-muted opacity-60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={18} className="text-success shrink-0" />
              ) : isCurrent ? (
                <Loader2 size={18} className="animate-spin text-purple-400 shrink-0" />
              ) : (
                <Circle size={18} className="text-text-muted shrink-0" />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PlanningLoader;
