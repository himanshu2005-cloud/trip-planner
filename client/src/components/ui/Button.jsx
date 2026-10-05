import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-2xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-white/[0.07] hover:bg-white/[0.12] text-text-primary border border-white/[0.1] hover:scale-[1.02] active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-text-secondary hover:text-text-primary',
    outline:
      'bg-transparent border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400',
    danger:
      'bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
