import React from 'react';

/**
 * BudgetSummary
 * Minimal editorial travel expense ledger.
 */
export const BudgetSummary = ({
  totalBudget = 40000,
  estimatedCost = 38500,
  breakdown = {
    attractions: 24000,
    food: 10000,
    transport: 4500,
  },
}) => {
  const categories = [
    { label: 'Attractions & Sightseeing', amount: breakdown.attractions || 0, percent: 62 },
    { label: 'Cuisine & Dining', amount: breakdown.food || 0, percent: 26 },
    { label: 'Local Transit', amount: breakdown.transport || 0, percent: 12 },
  ];

  return (
    <div className="w-full bg-[#131317] border border-[#23232c] p-6 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-[#23232c] gap-2">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7a5293]">
            EXPEDITION LEDGER
          </span>
          <h3 className="font-serif text-xl text-[#f5f2eb] mt-0.5">
            Estimated Budget Allocation
          </h3>
        </div>

        <div className="text-left sm:text-right">
          <span className="font-mono text-[10px] tracking-wider text-[#5c5851] uppercase block">
            EST. TOTAL / TARGET
          </span>
          <span className="font-mono text-base font-semibold text-[#f5f2eb]">
            ₹{estimatedCost.toLocaleString()}{' '}
            <span className="text-xs font-normal text-[#5c5851]">
              / ₹{totalBudget?.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
        {categories.map((cat) => (
          <div key={cat.label} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-wider text-[#9e9a91] uppercase">
              {cat.label}
            </span>
            <span className="font-mono text-sm text-[#f5f2eb]">
              ₹{cat.amount.toLocaleString()}
            </span>
            <div className="w-full h-[2px] bg-[#1c1c23] mt-1 overflow-hidden">
              <div
                className="h-full bg-[#7a5293]"
                style={{ width: `${Math.min(cat.percent, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSummary;
