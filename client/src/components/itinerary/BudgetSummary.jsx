import React from 'react';
import { Wallet, IndianRupee } from 'lucide-react';
import Card from '../ui/Card';

export const BudgetSummary = ({ totalBudget = 40000, estimatedCost = 36850 }) => {
  const remaining = Math.max(0, totalBudget - estimatedCost);
  const percentage = Math.min(100, Math.round((estimatedCost / totalBudget) * 100));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Wallet size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Trip Budget</h4>
            <p className="text-xs text-text-muted">Allocated vs Estimated</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-bold text-text-primary">
            ₹{estimatedCost.toLocaleString()}
          </span>
          <span className="text-xs text-text-muted"> / ₹{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden mb-2">
        <div
          className="bg-gradient-to-r from-purple-600 to-accent-pink h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>{percentage}% utilized</span>
        <span className="text-success font-medium">
          ₹{remaining.toLocaleString()} remaining
        </span>
      </div>
    </Card>
  );
};

export default BudgetSummary;
