import React from 'react';
import { Wallet, IndianRupee, PieChart, Tag, Utensils, Bus, Ticket } from 'lucide-react';
import Card from '../ui/Card';

export const BudgetSummary = ({
  totalBudget = 40000,
  estimatedCost = 36850,
  breakdown = {
    attractions: 22400,
    food: 9850,
    transport: 4600,
  },
}) => {
  const remaining = Math.max(0, totalBudget - estimatedCost);
  const percentage = Math.min(100, Math.round((estimatedCost / totalBudget) * 100));

  const categories = [
    { label: 'Attractions', amount: breakdown.attractions, color: 'bg-purple-500', icon: Ticket },
    { label: 'Food & Dining', amount: breakdown.food, color: 'bg-accent-pink', icon: Utensils },
    { label: 'Transport', amount: breakdown.transport, color: 'bg-accent-blue', icon: Bus },
  ];

  return (
    <Card className="p-6 border-purple-500/20 shadow-glass">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Wallet size={18} />
          </div>
          <div>
            <h4 className="text-base font-semibold text-text-primary tracking-tight">
              Trip Budget
            </h4>
            <p className="text-xs text-text-muted">Adherence & Daily Breakdown</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-xl font-bold text-text-primary tracking-tight">
              ₹{estimatedCost.toLocaleString()}
            </span>
            <span className="text-xs text-text-muted">
              / ₹{totalBudget.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-md border border-success/30 inline-block mt-0.5">
            ₹{remaining.toLocaleString()} remaining
          </span>
        </div>
      </div>

      {/* Main Budget Bar (DESIGN.md §16) */}
      <div className="mb-4">
        <div className="w-full bg-white/[0.06] rounded-full h-3 overflow-hidden p-0.5 border border-white/[0.06] flex">
          <div
            className="bg-gradient-to-r from-purple-600 via-accent-pink to-accent-blue h-full rounded-full transition-all duration-500 shadow-glow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-text-muted mt-2">
          <span>{percentage}% of total budget allocated</span>
          <span className="text-purple-300 font-medium">Within constraints</span>
        </div>
      </div>

      {/* Category Breakdown (DESIGN.md §16: Attractions, Food, Transport) */}
      <div className="pt-2">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block mb-2.5">
          Expense Breakdown
        </span>
        <div className="grid grid-cols-3 gap-2">
          {categories.map(({ label, amount, color, icon: Icon }) => (
            <div
              key={label}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5 text-text-secondary text-[11px] mb-1">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="truncate">{label}</span>
              </div>
              <span className="text-sm font-bold text-text-primary">
                ₹{amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BudgetSummary;
