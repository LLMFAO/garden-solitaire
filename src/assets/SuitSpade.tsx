import React from 'react';

const SuitSpade: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = 'var(--accent-lavender)' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C7 8 3 11 3 15c0 2.76 2.24 5 5 5 1.5 0 2.87-.66 3.8-1.72-.2.55-.8 2.42-3.8 2.42h8c-3 0-3.6-1.87-3.8-2.42.93 1.06 2.3 1.72 3.8 1.72 2.76 0 5-2.24 5-5 0-4-4-7-9-13z"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
    />
  </svg>
);

export default SuitSpade;
