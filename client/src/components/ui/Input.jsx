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
          className="text-[13px] font-medium text-[#f4f4f5]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-[#a1a1aa] pointer-events-none flex items-center">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          className={`input ${Icon ? 'pl-9' : ''} ${error ? 'border-[#ef4444]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-[12px] text-[#ef4444] mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
