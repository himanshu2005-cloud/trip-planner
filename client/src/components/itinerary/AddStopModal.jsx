import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { getSuggestionsForDestination } from '../../utils/stopSuggestions';

export const AddStopModal = ({
  isOpen,
  onClose,
  onAddStop,
  dayNumber = 1,
  destination = 'Jaipur, Rajasthan',
}) => {
  const suggestions = getSuggestionsForDestination(destination);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Heritage & Culture');
  const [startTime, setStartTime] = useState('14:30');
  const [duration, setDuration] = useState(60);
  const [cost, setCost] = useState(150);
  const [description, setDescription] = useState('');

  const handleSelectSuggestion = (sug) => {
    setName(sug.name);
    setCategory(sug.category);
    setDuration(sug.duration);
    setCost(sug.cost);
    setDescription(sug.description);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStop({
      name: name.trim(),
      category: category.trim(),
      startTime: startTime || '14:00',
      duration: Number(duration) || 60,
      cost: Number(cost) || 0,
      description: description.trim(),
      rating: 4.8,
      travelToNext: { durationMinutes: 15, distanceKm: 2.1 },
    });

    // Reset
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Stop to Day 0${dayNumber}`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        {/* Curated 1-Click Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#7a5293] uppercase font-semibold block mb-2.5">
              QUICK RECOMMENDATIONS FOR {destination.split(',')[0].toUpperCase()}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug.name}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug)}
                  className="text-left p-3 rounded-lg border dark:border-[#23232c] border-[#e2dbcd] dark:bg-[#14141a] bg-[#f8f5ee] hover:border-[#7a5293] dark:hover:bg-[#181822] hover:bg-[#f1ede3] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#7a5293] mb-1">
                    <span className="uppercase">{sug.category}</span>
                    <span>₹{sug.cost}</span>
                  </div>
                  <h4 className="font-serif text-sm dark:text-[#f5f2eb] text-[#18181c] group-hover:text-[#7a5293] font-medium leading-snug">
                    {sug.name}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Place Entry Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t dark:border-[#23232c] border-[#e2dbcd] pt-5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#cebfdf] uppercase font-semibold">
            STOP DETAILS
          </span>

          <div>
            <label className="block text-[11px] font-mono dark:text-[#9e9a91] text-[#635f56] uppercase mb-1">
              Place / Attraction Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rawat Mishthan Bhandar or Albert Hall Museum"
              className="editorial-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono dark:text-[#9e9a91] text-[#635f56] uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="editorial-input text-xs"
              >
                <option value="Heritage & Forts">Heritage & Forts</option>
                <option value="Spiritual & Temples">Spiritual & Temples</option>
                <option value="Food Trail & Cafe">Food Trail & Cafe</option>
                <option value="Local Bazaar">Local Bazaar</option>
                <option value="Scenic & Nature">Scenic & Nature</option>
                <option value="Museum & Art">Museum & Art</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono dark:text-[#9e9a91] text-[#635f56] uppercase mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="14:30"
                className="editorial-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono dark:text-[#9e9a91] text-[#635f56] uppercase mb-1">
                Est. Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="150"
                className="editorial-input text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono dark:text-[#9e9a91] text-[#635f56] uppercase mb-1">
              Curator Notes / Tip
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Try the hot pyaaz kachori; best visited before the evening crowd."
              className="editorial-input text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase dark:text-[#9e9a91] text-[#635f56] hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#6D3FD9] hover:bg-[#5b2fb8] text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              + Add to Itinerary
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddStopModal;
