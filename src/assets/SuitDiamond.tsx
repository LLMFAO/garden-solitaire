import React from 'react';

const SuitDiamond: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = 'var(--accent-peach)' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L22 12L12 22L2 12Z"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
    />
  </svg>
);

export default SuitDiamond;
