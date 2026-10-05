import React from 'react';
import {
  Landmark,
  UtensilsCrossed,
  Trees,
  Building2,
  ShoppingBag,
  Moon,
  Theater,
  Compass,
} from 'lucide-react';

export const INTEREST_OPTIONS = [
  { id: 'History', label: 'History', icon: Landmark },
  { id: 'Food', label: 'Food & Dining', icon: UtensilsCrossed },
  { id: 'Nature', label: 'Nature & Parks', icon: Trees },
  { id: 'Architecture', label: 'Architecture', icon: Building2 },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'Nightlife', label: 'Nightlife', icon: Moon },
  { id: 'Culture', label: 'Art & Culture', icon: Theater },
  { id: 'Adventure', label: 'Adventure', icon: Compass },
];

export const InterestSelector = ({ selectedInterests = [], onChange }) => {
  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      onChange(selectedInterests.filter((item) => item !== id));
    } else {
      onChange([...selectedInterests, id]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-text-secondary tracking-wide uppercase">
        Select Your Interests
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {INTEREST_OPTIONS.map(({ id, label, icon: Icon }) => {
          const isSelected = selectedInterests.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleInterest(id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none text-left border ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white border-purple-400/60 shadow-glow-sm scale-[1.02]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-text-secondary hover:text-text-primary border-white/[0.08]'
              }`}
            >
              <Icon size={15} className={isSelected ? 'text-white' : 'text-purple-400'} />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestSelector;
