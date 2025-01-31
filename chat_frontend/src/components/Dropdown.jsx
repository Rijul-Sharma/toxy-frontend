import React, { useRef, useEffect, useState } from 'react';

const Dropdown = ({ 
  options = [], 
  isOpen, 
  onClose,
  onSelect,
  className = '',
  containerClassName = '',
  maxHeight = '15rem'
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={containerClassName}>
      <div 
        ref={dropdownRef}
        style={{ maxHeight }}
        className={`bg-white border rounded-bl-md rounded-br-md shadow-lg overflow-auto ${className}`}
      >
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect?.(option);
              onClose?.();
            }}
            className={`w-full px-4 py-2 text-left transition-colors
              ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${option.className || ''}`} // Add custom className from the option
              disabled={option.disabled}
              style={option.style || {}}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;