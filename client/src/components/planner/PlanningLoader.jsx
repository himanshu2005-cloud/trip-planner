import React from 'react';

export const PLANNING_STEPS = [
  { id: 'attractions', label: 'Archival research', desc: 'Querying high-rated architecture, cultural places & landmarks' },
  { id: 'clustering', label: 'Geographic clustering', desc: 'Partitioning neighborhoods across daily chapters' },
  { id: 'routing', label: 'Route sequencing', desc: 'Calculating walking paths and logical transitions' },
  { id: 'hours', label: 'Verifying opening windows', desc: 'Aligning morning, afternoon, and evening dwell times' },
  { id: 'weather', label: 'Meteorological validation', desc: 'Checking seasonal forecasts and indoor contingencies' },
];

export const PlanningLoader = ({ currentStepIndex = 2 }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-[#131317] border border-[#23232c] p-8 sm:p-10 flex flex-col">
      <div className="flex items-baseline justify-between pb-4 border-b border-[#23232c] mb-6">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#7a5293] uppercase font-semibold">
          DISPATCH · IN PROGRESS
        </span>
        <span className="font-mono text-[10px] text-[#5c5851] uppercase">
          STAGE 0{currentStepIndex + 1} / 05
        </span>
      </div>

      <h3 className="font-serif text-3xl text-[#f5f2eb] mb-2">
        Composing your journal...
      </h3>
      <p className="font-serif italic text-sm text-[#9e9a91] mb-8">
        Organizing geography, pacing, and neighborhood sequences into a cohesive itinerary.
      </p>

      {/* Step Sequence */}
      <div className="flex flex-col gap-4 font-mono text-xs">
        {PLANNING_STEPS.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-3 border transition-colors ${
                isCurrent
                  ? 'bg-[#181822] border-[#7a5293] text-[#f5f2eb]'
                  : isDone
                  ? 'bg-transparent border-[#1c1c23] text-[#9e9a91]'
                  : 'bg-transparent border-transparent text-[#5c5851]'
              }`}
            >
              <span className="shrink-0 text-[11px] font-semibold">
                {isDone ? '✓' : isCurrent ? '●' : '○'}
              </span>

              <div className="flex flex-col">
                <span className={isCurrent ? 'text-[#cebfdf] font-medium' : ''}>
                  {step.label}
                </span>
                <span className="text-[10px] text-[#5c5851] mt-0.5">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanningLoader;
