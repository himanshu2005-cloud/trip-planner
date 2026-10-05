import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';

export const ShareTripModal = ({
  isOpen,
  onClose,
  destination = 'Jaipur, Rajasthan',
  days = [],
  budget = 24000,
}) => {
  const [copied, setCopied] = useState(false);

  const currentUrl = window.location.href;

  const generateWhatsAppMessage = () => {
    let text = `✈️ *TripPilot India Itinerary: ${destination}*\n`;
    text += `📅 Duration: ${days.length} Days | 💰 Est. Budget: ₹${budget.toLocaleString()}\n\n`;

    days.forEach((day) => {
      text += `*Day 0${day.dayNumber} — ${day.title || 'Exploration'}*\n`;
      (day.stops || []).forEach((stop, idx) => {
        text += `  • ${stop.startTime || '09:00'} - ${stop.name} (₹${stop.cost || 0})\n`;
      });
      text += '\n';
    });

    text += `🗺️ Planned with TripPilot: ${currentUrl}`;
    return text;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Trip Itinerary"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-5">
        <p className="font-serif italic text-sm dark:text-[#9e9a91] text-[#635f56]">
          Share this day-by-day expedition with your travel group or export directly to WhatsApp.
        </p>

        {/* 1-Click WhatsApp Share Button */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <MessageCircle size={16} />
          <span>Share to WhatsApp Group</span>
        </button>

        {/* Copy Link Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-mono dark:text-[#9e9a91] text-[#635f56] uppercase">
            Shareable Web Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="editorial-input text-xs font-mono truncate"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-lg bg-[#6D3FD9] hover:bg-[#5b2fb8] text-white font-mono text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareTripModal;
