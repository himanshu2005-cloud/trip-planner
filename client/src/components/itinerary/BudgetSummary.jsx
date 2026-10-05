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
    <div className="w-full dark:bg-[#131317] bg-white border dark:border-[#23232c] border-[#ded7ca] p-6 mt-10 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b dark:border-[#23232c] border-[#e8e2d5] gap-2">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6D3FD9] dark:text-[#a78bfa] font-semibold">
            EXPEDITION LEDGER
          </span>
          <h3 className="font-serif text-xl sm:text-2xl dark:text-[#ffffff] text-[#18181c] font-normal mt-0.5">
            Estimated Budget Allocation
          </h3>
        </div>

        <div className="text-left sm:text-right">
          <span className="font-mono text-[10px] tracking-wider dark:text-[#7e796e] text-[#6b6558] uppercase block">
            EST. TOTAL / TARGET
          </span>
          <span className="font-mono text-base font-bold dark:text-[#ffffff] text-[#18181c]">
            ₹{estimatedCost.toLocaleString()}{' '}
            <span className="text-xs font-normal dark:text-[#7e796e] text-[#847c6d]">
              / ₹{totalBudget?.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
        {categories.map((cat) => (
          <div key={cat.label} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-wider dark:text-[#a09c93] text-[#5c564b] uppercase font-medium">
              {cat.label}
            </span>
            <span className="font-mono text-sm font-semibold dark:text-[#ffffff] text-[#18181c]">
              ₹{cat.amount.toLocaleString()}
            </span>
            <div className="w-full h-[3px] dark:bg-[#202028] bg-[#e8e2d5] mt-1 overflow-hidden rounded-full">
              <div
                className="h-full bg-[#6D3FD9] dark:bg-[#a855f7]"
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
