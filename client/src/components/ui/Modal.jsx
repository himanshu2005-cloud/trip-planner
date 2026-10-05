import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full ${maxWidth}`}>
        <Card className="p-6 relative border border-white/[0.15]">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
            >
              <X size={18} />
            </button>
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
};

export default Modal;
