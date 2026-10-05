import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  wrapperClassName = '',
  id,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium text-text-secondary tracking-wide uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          className={`w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted text-sm transition-all duration-200 focus:outline-none focus:border-purple-400 focus:bg-white/[0.08] focus:ring-1 focus:ring-purple-400/40 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-danger/60 focus:border-danger' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-danger mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
