import React, { useState } from 'react';
import { CloudRain, ArrowRight, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const WeatherAlert = ({
  time = '3:00 PM',
  rainForecast = 'Rain expected at 3 PM',
  originalRoute = 'Eiffel Tower → Luxembourg Gardens (Outdoor)',
  updatedRoute = 'Eiffel Tower → Louvre Museum (Indoor Alternative)',
  applied = true,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 sm:p-5 border-accent-blue/30 bg-accent-blue/[0.04] shadow-glass relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <CloudRain size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-sm font-semibold text-text-primary tracking-tight">
                ☔ {rainForecast}
              </h4>
              <Badge variant="purple" className="text-[10px]">
                Intelligent Adjustment
              </Badge>
            </div>
            <p className="text-xs text-text-secondary">
              Outdoor activities have been automatically swapped for high-rated indoor alternatives.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          title="Toggle adjustment details"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Comparison card (DESIGN.md §17) */}
      <div className="mt-3.5 pt-3.5 border-t border-white/[0.08] flex flex-col gap-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] uppercase font-semibold text-text-muted block mb-1">
              Original Plan
            </span>
            <span className="text-text-secondary line-through opacity-70 block">
              {originalRoute}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-600/15 border border-purple-500/30">
            <span className="text-[10px] uppercase font-semibold text-purple-300 block mb-1">
              Optimized Replacement
            </span>
            <span className="text-purple-200 font-medium block">
              {updatedRoute}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="text-[11px] text-text-muted bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05] mt-1">
            Weather adjustment is isolated to the affected time slot so other trip days remain intact.
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeatherAlert;
