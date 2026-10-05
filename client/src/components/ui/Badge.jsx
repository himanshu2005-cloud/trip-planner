import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  className = '',
  icon: Icon,
}) => {
  const variantStyles = {
    default: 'bg-white/[0.08] text-text-secondary border-white/[0.08]',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
