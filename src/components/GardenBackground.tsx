import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Plant {
  id: number;
  x: number;
  y: number;
  type: 'flower' | 'tree' | 'bush' | 'grass' | 'spire' | 'orchid';
  color: string;
  size: number;
  delay: number;
}

interface GardenBoostToken {
  id: number;
  type: 'sun' | 'water';
  x: number;
  y: number;
  midX: number;
  endX: number;
  duration: number;
}

const PLANTS: Plant[] = [
  // Low box edging and early foliage.
  { id: 1, x: 4, y: 98, type: 'grass', color: '#4B7A4C', size: 1.1, delay: 0 },
  { id: 2, x: 10, y: 96, type: 'bush', color: '#527E50', size: 1.15, delay: 0 },
  { id: 3, x: 16, y: 98, type: 'grass', color: '#6E8F5A', size: 1.1, delay: 0 },
  { id: 4, x: 23, y: 96, type: 'flower', color: '#C78A9D', size: 0.82, delay: 0 },
  { id: 5, x: 31, y: 97, type: 'bush', color: '#496F45', size: 1.22, delay: 0 },
  { id: 6, x: 39, y: 95, type: 'flower', color: '#AFA0C8', size: 0.78, delay: 0 },
  { id: 7, x: 48, y: 98, type: 'grass', color: '#5E7D50', size: 1.25, delay: 0 },
  { id: 8, x: 56, y: 96, type: 'flower', color: '#D7B7A3', size: 0.82, delay: 0 },
  { id: 9, x: 65, y: 97, type: 'bush', color: '#527E50', size: 1.2, delay: 0 },
  { id: 10, x: 73, y: 95, type: 'flower', color: '#C98DA1', size: 0.78, delay: 0 },
  { id: 11, x: 82, y: 98, type: 'grass', color: '#6C8B5A', size: 1.15, delay: 0 },
  { id: 12, x: 92, y: 96, type: 'bush', color: '#486D43', size: 1.1, delay: 0 },

  // Middle border: roses, lavender, and clipped shrubs.
  { id: 13, x: 8, y: 91, type: 'flower', color: '#B56E82', size: 0.9, delay: 0.04 },
  { id: 14, x: 15, y: 88, type: 'spire', color: '#E8DCC6', size: 1.05, delay: 0.08 },
  { id: 15, x: 23, y: 90, type: 'flower', color: '#E1C5B1', size: 0.95, delay: 0.05 },
  { id: 16, x: 32, y: 87, type: 'orchid', color: '#F2EFE4', size: 1.02, delay: 0.1 },
  { id: 17, x: 41, y: 91, type: 'flower', color: '#C07A8E', size: 0.88, delay: 0.06 },
  { id: 18, x: 50, y: 89, type: 'bush', color: '#3E6B43', size: 1.35, delay: 0.12 },
  { id: 19, x: 59, y: 87, type: 'spire', color: '#D8C8A7', size: 1.18, delay: 0.1 },
  { id: 20, x: 68, y: 90, type: 'flower', color: '#D6A0A8', size: 0.94, delay: 0.06 },
  { id: 21, x: 77, y: 88, type: 'orchid', color: '#F5F1E6', size: 1.05, delay: 0.09 },
  { id: 22, x: 86, y: 91, type: 'flower', color: '#E5C8B6', size: 0.9, delay: 0.04 },

  // Taller back border that grows upward as the garden matures.
  { id: 23, x: 12, y: 79, type: 'spire', color: '#E8DDC6', size: 1.35, delay: 0.18 },
  { id: 24, x: 20, y: 82, type: 'flower', color: '#C66F84', size: 1.15, delay: 0.16 },
  { id: 25, x: 29, y: 76, type: 'orchid', color: '#F4EFE2', size: 1.32, delay: 0.23 },
  { id: 26, x: 38, y: 80, type: 'flower', color: '#D9B9C0', size: 1.08, delay: 0.18 },
  { id: 27, x: 47, y: 74, type: 'spire', color: '#CFC09B', size: 1.45, delay: 0.28 },
  { id: 28, x: 56, y: 81, type: 'flower', color: '#B9697C', size: 1.1, delay: 0.18 },
  { id: 29, x: 65, y: 76, type: 'orchid', color: '#EFE7D1', size: 1.3, delay: 0.24 },
  { id: 30, x: 74, y: 82, type: 'flower', color: '#E3C1A7', size: 1.04, delay: 0.17 },
  { id: 31, x: 83, y: 78, type: 'spire', color: '#D9CEAF', size: 1.38, delay: 0.2 },
  { id: 32, x: 91, y: 83, type: 'flower', color: '#C98393', size: 1, delay: 0.16 },

  // Fine filler and repeated planting rhythm.
  { id: 33, x: 5, y: 86, type: 'grass', color: '#536F46', size: 1.2, delay: 0.11 },
  { id: 34, x: 18, y: 84, type: 'flower', color: '#E7D8BE', size: 0.76, delay: 0.12 },
  { id: 35, x: 36, y: 84, type: 'flower', color: '#C58D9E', size: 0.78, delay: 0.14 },
  { id: 36, x: 52, y: 86, type: 'grass', color: '#617D52', size: 1.2, delay: 0.13 },
  { id: 37, x: 71, y: 84, type: 'flower', color: '#E8D5C4', size: 0.76, delay: 0.14 },
  { id: 38, x: 95, y: 86, type: 'grass', color: '#536F46', size: 1.15, delay: 0.11 },

  // Mature border additions: later point levels keep revealing new plant styles.
  { id: 39, x: 9, y: 72, type: 'orchid', color: '#F7F1E6', size: 1.4, delay: 0.34 },
  { id: 40, x: 17, y: 75, type: 'flower', color: '#D79AA7', size: 1.28, delay: 0.38 },
  { id: 41, x: 26, y: 69, type: 'spire', color: '#D6C39E', size: 1.7, delay: 0.46 },
  { id: 42, x: 35, y: 73, type: 'bush', color: '#3F6642', size: 1.7, delay: 0.42 },
  { id: 43, x: 44, y: 68, type: 'flower', color: '#F3E8D4', size: 1.28, delay: 0.52 },
  { id: 44, x: 53, y: 72, type: 'flower', color: '#E6C9A9', size: 1.25, delay: 0.4 },
  { id: 45, x: 62, y: 67, type: 'orchid', color: '#F8F3E8', size: 1.42, delay: 0.5 },
  { id: 46, x: 71, y: 74, type: 'flower', color: '#C47688', size: 1.24, delay: 0.36 },
  { id: 47, x: 80, y: 69, type: 'spire', color: '#D8C8A7', size: 1.65, delay: 0.44 },
  { id: 48, x: 90, y: 73, type: 'bush', color: '#466F47', size: 1.62, delay: 0.4 },
  { id: 49, x: 13, y: 64, type: 'flower', color: '#EEE1C8', size: 1.12, delay: 0.58 },
  { id: 50, x: 31, y: 62, type: 'orchid', color: '#F5EFE2', size: 1.55, delay: 0.66 },
  { id: 51, x: 50, y: 61, type: 'flower', color: '#B96F82', size: 1.34, delay: 0.62 },
  { id: 52, x: 68, y: 63, type: 'spire', color: '#CDBD98', size: 1.82, delay: 0.68 },
  { id: 53, x: 87, y: 65, type: 'flower', color: '#E2B8A5', size: 1.18, delay: 0.6 },
  { id: 54, x: 7, y: 58, type: 'flower', color: '#F2E9D5', size: 1.18, delay: 0.72 },
  { id: 55, x: 18, y: 60, type: 'flower', color: '#D2A0AD', size: 1.22, delay: 0.74 },
  { id: 56, x: 28, y: 56, type: 'orchid', color: '#FAF6EA', size: 1.65, delay: 0.78 },
  { id: 57, x: 39, y: 59, type: 'flower', color: '#F0DEC2', size: 1.18, delay: 0.8 },
  { id: 58, x: 50, y: 55, type: 'flower', color: '#F4E7CF', size: 1.3, delay: 0.84 },
  { id: 59, x: 61, y: 59, type: 'flower', color: '#C48798', size: 1.22, delay: 0.82 },
  { id: 60, x: 72, y: 56, type: 'orchid', color: '#F7F2E7', size: 1.6, delay: 0.88 },
  { id: 61, x: 83, y: 60, type: 'flower', color: '#E8CDB7', size: 1.14, delay: 0.9 },
  { id: 62, x: 94, y: 58, type: 'flower', color: '#EFE0C5', size: 1.16, delay: 0.92 },
  { id: 63, x: 21, y: 51, type: 'flower', color: '#C16F83', size: 1.36, delay: 0.94 },
  { id: 64, x: 42, y: 49, type: 'orchid', color: '#FBF7EE', size: 1.72, delay: 0.96 },
  { id: 65, x: 64, y: 50, type: 'flower', color: '#E5D6BC', size: 1.3, delay: 0.95 },
  { id: 66, x: 82, y: 51, type: 'orchid', color: '#F6F0E2', size: 1.62, delay: 0.98 },
];

const FlowerSVG: React.FC<{ color: string; size: number; progress: number }> = ({ color, size, progress }) => {
  const scale = size * (0.3 + progress * 0.7);
  return (
    <svg width={36 * scale} height={44 * scale} viewBox="0 0 36 44" style={{ overflow: 'visible' }}>
      {/* Stem */}
      <motion.path
        d="M18 44 Q18 27 18 16"
        stroke="#3F8E44"
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      {/* Leaves */}
      <motion.path
        d="M18 32 Q9 30 6 26 Q12 32 18 32"
        fill="#5FAF63"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{ transformOrigin: '18px 32px' }}
      />
      <motion.path
        d="M18 27 Q27 24 30 20 Q24 27 18 27"
        fill="#7BC67F"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 0.5, delay: 0.7 }}
        style={{ transformOrigin: '18px 27px' }}
      />
      {/* Petals */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
        style={{ transformOrigin: '18px 13px' }}
      >
        <ellipse cx="18" cy="7" rx="3.2" ry="5.8" fill={color} opacity={0.88} />
        <ellipse cx="11.5" cy="12" rx="3.4" ry="5.6" fill={color} opacity={0.82} transform="rotate(-48 11.5 12)" />
        <ellipse cx="24.5" cy="12" rx="3.4" ry="5.6" fill={color} opacity={0.82} transform="rotate(48 24.5 12)" />
        <ellipse cx="13" cy="19" rx="3" ry="5" fill={color} opacity={0.72} transform="rotate(35 13 19)" />
        <ellipse cx="23" cy="19" rx="3" ry="5" fill={color} opacity={0.72} transform="rotate(-35 23 19)" />
        <circle cx="18" cy="13.5" r="3.6" fill="rgba(255, 236, 179, 0.95)" />
        <circle cx="18" cy="13.5" r="1.2" fill="#8D6E63" opacity={0.45} />
      </motion.g>
    </svg>
  );
};

const SpireSVG: React.FC<{ color: string; size: number; progress: number }> = ({ color, size, progress }) => {
  const scale = size * (0.35 + progress * 0.65);
  return (
    <svg width={26 * scale} height={72 * scale} viewBox="0 0 26 72" style={{ overflow: 'visible' }}>
      <motion.path
        d="M13 72 C13 52 13 32 13 10"
        stroke="#466B43"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.9, type: 'spring' }}
      />
      <motion.g
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: progress, scaleY: progress }}
        transition={{ duration: 0.8, delay: 0.18 }}
        style={{ transformOrigin: '13px 72px' }}
      >
        {[12, 19, 26, 33, 40, 47, 54].map((cy, index) => (
          <React.Fragment key={cy}>
            <ellipse cx={index % 2 === 0 ? 9 : 17} cy={cy} rx="3.6" ry="5.2" fill={color} opacity={0.82 - index * 0.045} />
            <ellipse cx={index % 2 === 0 ? 17 : 9} cy={cy + 3} rx="3.1" ry="4.5" fill={color} opacity={0.68 - index * 0.035} />
          </React.Fragment>
        ))}
        <path d="M13 58 C6 54 5 47 5 43 C10 46 12 51 13 58" fill="#6F8B5B" opacity="0.85" />
        <path d="M13 50 C20 47 21 40 21 36 C16 40 14 45 13 50" fill="#7E9967" opacity="0.8" />
      </motion.g>
    </svg>
  );
};

const OrchidSVG: React.FC<{ color: string; size: number; progress: number }> = ({ color, size, progress }) => {
  const scale = size * (0.35 + progress * 0.65);
  return (
    <svg width={42 * scale} height={58 * scale} viewBox="0 0 42 58" style={{ overflow: 'visible' }}>
      <motion.path
        d="M21 58 C21 43 20 31 22 18"
        stroke="#4F7449"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.85, type: 'spring' }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: progress, scale: progress }}
        transition={{ duration: 0.75, delay: 0.2, type: 'spring' }}
        style={{ transformOrigin: '21px 20px' }}
      >
        <ellipse cx="21" cy="12" rx="5.5" ry="9" fill={color} opacity="0.94" />
        <ellipse cx="12.5" cy="20" rx="5.8" ry="9.5" fill={color} opacity="0.86" transform="rotate(-48 12.5 20)" />
        <ellipse cx="29.5" cy="20" rx="5.8" ry="9.5" fill={color} opacity="0.86" transform="rotate(48 29.5 20)" />
        <ellipse cx="17" cy="28" rx="5" ry="7.5" fill={color} opacity="0.76" transform="rotate(25 17 28)" />
        <ellipse cx="25" cy="28" rx="5" ry="7.5" fill={color} opacity="0.76" transform="rotate(-25 25 28)" />
        <path d="M16 21 C19 17 24 17 27 21 C25 28 18 28 16 21" fill="#F1D9A3" opacity="0.88" />
        <circle cx="21" cy="22" r="2.1" fill="#9C6A5F" opacity="0.45" />
      </motion.g>
      <motion.path
        d="M21 43 C12 40 9 34 8 29 C15 32 19 37 21 43"
        fill="#6F8B5B"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress * 0.75 }}
        transition={{ duration: 0.55, delay: 0.28 }}
        style={{ transformOrigin: '21px 43px' }}
      />
    </svg>
  );
};

const TreeSVG: React.FC<{ color: string; size: number; progress: number }> = ({ color, size, progress }) => {
  const scale = size * (0.4 + progress * 0.6);
  return (
    <svg width={40 * scale} height={60 * scale} viewBox="0 0 40 60" style={{ overflow: 'visible' }}>
      {/* Trunk */}
      <motion.path
        d="M20 60 L20 30"
        stroke="#795548"
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.8 }}
      />
      {/* Branches */}
      <motion.path
        d="M20 45 L10 35 M20 40 L30 32"
        stroke="#795548"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: progress, opacity: progress }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      {/* Foliage */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
        style={{ transformOrigin: '20px 25px' }}
      >
        <circle cx="20" cy="20" r={12} fill={color} />
        <circle cx="12" cy="28" r={8} fill={color} opacity={0.9} />
        <circle cx="28" cy="26" r={9} fill={color} opacity={0.9} />
        <circle cx="15" cy="15" r={7} fill={color} opacity={0.8} />
        <circle cx="25" cy="18" r={6} fill={color} opacity={0.8} />
        <circle cx="20" cy="10" r={5} fill="#81C784" opacity={0.7} />
      </motion.g>
    </svg>
  );
};

const BushSVG: React.FC<{ color: string; size: number; progress: number }> = ({ color, size, progress }) => {
  const scale = size * (0.5 + progress * 0.5);
  return (
    <svg width={50 * scale} height={30 * scale} viewBox="0 0 50 30">
      <motion.g
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: progress, opacity: progress }}
        transition={{ duration: 0.8, type: 'spring' }}
        style={{ transformOrigin: '25px 30px' }}
      >
        <ellipse cx="15" cy="25" rx="12" ry="10" fill={color} />
        <ellipse cx="35" cy="23" rx="14" ry="11" fill={color} opacity={0.9} />
        <ellipse cx="25" cy="18" rx="10" ry="8" fill={color} opacity={0.85} />
        <circle cx="20" cy="20" r="3" fill="#FFD600" opacity={0.6} />
        <circle cx="30" cy="18" r="2.5" fill="#FF5252" opacity={0.5} />
        <circle cx="15" cy="22" r="2" fill="#FFFFFF" opacity={0.4} />
      </motion.g>
    </svg>
  );
};

const GrassSVG: React.FC<{ color: string; size: number; progress: number }> = ({ color, size, progress }) => {
  const scale = size * (0.5 + progress * 0.5);
  return (
    <svg width={30 * scale} height={20 * scale} viewBox="0 0 30 20" style={{ overflow: 'visible' }}>
      <motion.g
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress }}
        transition={{ duration: 0.5, type: 'spring' }}
        style={{ transformOrigin: '15px 20px' }}
      >
        <path d="M5 20 Q5 10 3 5 Q7 12 8 20" fill={color} />
        <path d="M12 20 Q12 8 10 3 Q14 10 15 20" fill={color} opacity={0.9} />
        <path d="M20 20 Q20 12 18 7 Q22 13 23 20" fill={color} opacity={0.85} />
        <path d="M26 20 Q26 10 24 6 Q28 11 28 20" fill={color} opacity={0.8} />
      </motion.g>
    </svg>
  );
};

const BritishGardenDetails: React.FC<{ progress: number }> = ({ progress }) => (
  <>
    {/* Stone edging and low box hedge, deliberately plain to avoid stripe/bar artifacts. */}
    {Array.from({ length: 18 }, (_, index) => (
      <div
        key={`stone-${index}`}
        style={{
          position: 'absolute',
          left: `${4 + index * 5.4}%`,
          bottom: `${30 + Math.sin(index * 0.7) * 1.2}%`,
          width: 10,
          height: 5,
          borderRadius: 8,
          background: '#D8D0BD',
          opacity: 0.55,
          boxShadow: '0 1px 2px rgba(84, 72, 56, 0.08)',
        }}
      />
    ))}
    {Array.from({ length: 22 }, (_, index) => (
      <motion.div
        key={`box-${index}`}
        style={{
          position: 'absolute',
          left: `${2 + index * 4.7}%`,
          bottom: `${25.5 + Math.sin(index * 0.55) * 1.4}%`,
          width: 18,
          height: 12,
          borderRadius: '50%',
          background: '#456F42',
          boxShadow: '0 3px 6px rgba(27, 94, 32, 0.13)',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: Math.min(1, progress * 5), opacity: Math.min(0.95, progress * 5) }}
        transition={{ delay: index * 0.025, type: 'spring', stiffness: 180, damping: 18 }}
      />
    ))}
  </>
);

const BorderMassSVG: React.FC<{ progress: number; bloom: string; width?: number; height?: number }> = ({
  progress,
  bloom,
  width = 86,
  height = 74,
}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
    <motion.g
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: progress, scaleY: progress }}
      transition={{ duration: 0.85, type: 'spring', stiffness: 130, damping: 18 }}
      style={{ transformOrigin: `${width / 2}px ${height}px` }}
    >
      {Array.from({ length: 18 }, (_, index) => {
        const x = 8 + (index * 17) % (width - 14);
        const h = 18 + (index % 5) * 8;
        const sway = index % 2 === 0 ? -7 : 7;
        return (
          <path
            key={`stem-${index}`}
            d={`M${x} ${height} C${x + sway} ${height - h * 0.45} ${x - sway * 0.3} ${height - h * 0.75} ${x + sway * 0.2} ${height - h}`}
            stroke={index % 3 === 0 ? '#486B45' : '#5E7B50'}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.78"
          />
        );
      })}
      {Array.from({ length: 14 }, (_, index) => {
        const x = 7 + (index * 19) % (width - 13);
        const y = height - 10 - (index % 6) * 8;
        return (
          <ellipse
            key={`leaf-${index}`}
            cx={x}
            cy={y}
            rx={5 + (index % 3)}
            ry={3.5 + (index % 2)}
            fill={index % 2 === 0 ? '#607D52' : '#789164'}
            opacity="0.72"
            transform={`rotate(${index % 2 === 0 ? -24 : 24} ${x} ${y})`}
          />
        );
      })}
      {Array.from({ length: 16 }, (_, index) => {
        const x = 9 + (index * 23) % (width - 14);
        const y = height - 20 - (index % 7) * 7;
        return (
          <circle
            key={`bloom-${index}`}
            cx={x}
            cy={y}
            r={index % 4 === 0 ? 3 : 2.2}
            fill={bloom}
            opacity={0.72}
          />
        );
      })}
    </motion.g>
  </svg>
);

const MATURE_BORDER_MASSES = [
  { id: 1, x: 12, y: 84, delay: 0.18, bloom: '#C58A98', width: 78, height: 58 },
  { id: 2, x: 31, y: 82, delay: 0.28, bloom: '#DCC7AA', width: 92, height: 66 },
  { id: 3, x: 51, y: 81, delay: 0.38, bloom: '#AD91C4', width: 98, height: 72 },
  { id: 4, x: 72, y: 83, delay: 0.48, bloom: '#C9768A', width: 90, height: 66 },
  { id: 5, x: 89, y: 85, delay: 0.58, bloom: '#E6D7BE', width: 72, height: 58 },
  { id: 6, x: 21, y: 72, delay: 0.68, bloom: '#A98BC0', width: 92, height: 84 },
  { id: 7, x: 50, y: 69, delay: 0.78, bloom: '#D19AA7', width: 112, height: 92 },
  { id: 8, x: 79, y: 72, delay: 0.88, bloom: '#E8D7BA', width: 92, height: 84 },
];

const POINT_BLOOMS = Array.from({ length: 96 }, (_, index) => ({
  id: index,
  x: 5 + ((index * 17) % 90),
  y: 94 - ((index * 11) % 38),
  color: ['#F6F0E2', '#E7D8BE', '#FFF9EC', '#D2A0AD', '#F2E7D0', '#E1C5B1'][index % 6],
  size: 0.55 + (index % 4) * 0.08,
}));

const PointBloomSVG: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={26 * size} height={32 * size} viewBox="0 0 26 32" style={{ overflow: 'visible' }}>
    <path d="M13 32 C13 24 13 18 13 11" stroke="#4F7449" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <ellipse cx="9" cy="22" rx="4" ry="2.5" fill="#6F8B5B" opacity="0.78" transform="rotate(-28 9 22)" />
    <ellipse cx="17" cy="18" rx="4" ry="2.5" fill="#7F9968" opacity="0.72" transform="rotate(28 17 18)" />
    <ellipse cx="13" cy="8" rx="2.4" ry="4" fill={color} opacity="0.82" />
    <ellipse cx="9.5" cy="11.5" rx="2.2" ry="3.6" fill={color} opacity="0.7" transform="rotate(-45 9.5 11.5)" />
    <ellipse cx="16.5" cy="11.5" rx="2.2" ry="3.6" fill={color} opacity="0.7" transform="rotate(45 16.5 11.5)" />
    <circle cx="13" cy="11.5" r="1.8" fill="#E9D9A8" />
  </svg>
);

const BeeSVG: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <svg width={28 * size} height={22 * size} viewBox="0 0 28 22" style={{ overflow: 'visible' }}>
    <ellipse cx="10" cy="8" rx="5" ry="3.5" fill="#D8E4F2" opacity="0.62" transform="rotate(-25 10 8)" />
    <ellipse cx="16" cy="8" rx="5" ry="3.5" fill="#D8E4F2" opacity="0.62" transform="rotate(25 16 8)" />
    <ellipse cx="14" cy="13" rx="8" ry="5.2" fill="#D9A833" />
    <path d="M9 9 C10 12 10 15 9 18 M14 8 C15 11 15 15 14 18 M19 9 C20 12 20 15 19 17" stroke="#4A3A24" strokeWidth="1.5" opacity="0.9" />
    <circle cx="6" cy="12" r="2.4" fill="#3C3124" />
    <path d="M4 10 C2 8 1 8 0 7 M5 9 C4 7 4 6 3 5" stroke="#3C3124" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const CenterpieceFlowerSVG: React.FC<{ progress: number }> = ({ progress }) => {
  const stemProgress = Math.min(1, progress / 0.28);
  const budProgress = Math.max(0, Math.min(1, (progress - 0.18) / 0.25));
  const bloomProgress = Math.max(0, Math.min(1, (progress - 0.42) / 0.3));
  const detailProgress = Math.max(0, Math.min(1, (progress - 0.72) / 0.2));

  return (
    <svg width={112} height={152} viewBox="0 0 112 152" style={{ overflow: 'visible' }}>
      <motion.path
        d="M56 152 C55 122 55 92 56 58"
        stroke="#3F6742"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: stemProgress }}
        transition={{ duration: 0.8, type: 'spring' }}
      />
      <motion.path
        d="M56 120 C35 112 26 95 25 82 C43 90 52 104 56 120"
        fill="#6F8B5B"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: stemProgress, opacity: stemProgress * 0.78 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{ transformOrigin: '56px 120px' }}
      />
      <motion.path
        d="M56 103 C78 94 86 77 86 64 C68 73 59 88 56 103"
        fill="#7F9968"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: stemProgress, opacity: stemProgress * 0.72 }}
        transition={{ duration: 0.7, delay: 0.28 }}
        style={{ transformOrigin: '56px 103px' }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: budProgress * (1 - bloomProgress * 0.45), scale: 0.4 + budProgress * 0.55 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformOrigin: '56px 52px' }}
      >
        <path d="M56 64 C39 49 43 30 56 18 C69 30 73 49 56 64" fill="#EFE5D0" />
        <path d="M56 64 C49 48 50 34 56 18 C62 34 63 48 56 64" fill="#D7B5A8" opacity="0.55" />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: bloomProgress, scale: bloomProgress }}
        transition={{ duration: 0.9, type: 'spring', stiffness: 120, damping: 16 }}
        style={{ transformOrigin: '56px 52px' }}
      >
        <ellipse cx="56" cy="23" rx="10" ry="23" fill="#FBF6EA" />
        <ellipse cx="34" cy="40" rx="11" ry="25" fill="#F4E7D7" transform="rotate(-48 34 40)" />
        <ellipse cx="78" cy="40" rx="11" ry="25" fill="#F4E7D7" transform="rotate(48 78 40)" />
        <ellipse cx="42" cy="67" rx="11" ry="24" fill="#E9C7BE" transform="rotate(30 42 67)" opacity="0.92" />
        <ellipse cx="70" cy="67" rx="11" ry="24" fill="#E9C7BE" transform="rotate(-30 70 67)" opacity="0.92" />
        <ellipse cx="56" cy="56" rx="18" ry="22" fill="#F7EEE1" opacity="0.88" />
        <path d="M42 54 C49 42 63 42 70 54 C67 73 45 73 42 54" fill="#E7C98D" opacity="0.88" />
        <circle cx="56" cy="58" r="5" fill="#A3745C" opacity="0.42" />
      </motion.g>
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: detailProgress }}
        transition={{ duration: 0.5 }}
      >
        <path d="M56 6 C55 21 55 36 56 51" stroke="#D8B8AE" strokeWidth="1" opacity="0.55" />
        <path d="M23 29 C35 39 44 47 54 56" stroke="#D8B8AE" strokeWidth="1" opacity="0.45" />
        <path d="M89 29 C77 39 68 47 58 56" stroke="#D8B8AE" strokeWidth="1" opacity="0.45" />
        <circle cx="48" cy="56" r="1.5" fill="#8E624F" opacity="0.45" />
        <circle cx="56" cy="53" r="1.5" fill="#8E624F" opacity="0.45" />
        <circle cx="64" cy="56" r="1.5" fill="#8E624F" opacity="0.45" />
      </motion.g>
    </svg>
  );
};

const SproutSVG: React.FC<{ progress: number; size?: number }> = ({ progress, size = 1 }) => {
  const scale = size * (0.6 + progress * 0.4);
  return (
    <svg width={34 * scale} height={34 * scale} viewBox="0 0 34 34" style={{ overflow: 'visible' }}>
      <motion.path
        d="M17 34 C17 25 17 19 17 12"
        stroke="#2E7D32"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.55, type: 'spring' }}
      />
      <motion.path
        d="M17 22 C9 18 7 12 7 8 C13 8 17 13 17 22"
        fill="#66BB6A"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 0.45, delay: 0.15, type: 'spring' }}
        style={{ transformOrigin: '17px 22px' }}
      />
      <motion.path
        d="M17 20 C25 16 27 10 27 6 C21 6 17 11 17 20"
        fill="#81C784"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 0.45, delay: 0.22, type: 'spring' }}
        style={{ transformOrigin: '17px 20px' }}
      />
    </svg>
  );
};

const SPROUTS = [
  { id: 1, x: 10, y: 89, size: 1 },
  { id: 2, x: 18, y: 91, size: 0.8 },
  { id: 3, x: 29, y: 88, size: 1.1 },
  { id: 4, x: 41, y: 90, size: 0.9 },
  { id: 5, x: 54, y: 88, size: 1 },
  { id: 6, x: 67, y: 91, size: 0.85 },
  { id: 7, x: 79, y: 89, size: 1.05 },
  { id: 8, x: 91, y: 90, size: 0.9 },
];

export const GardenBackground: React.FC = () => {
  const foundation = useGameStore((s) => s.foundation);
  const moves = useGameStore((s) => s.moves);
  const gardenBoosts = useGameStore((s) => s.gardenBoosts);
  const popGardenBoost = useGameStore((s) => s.popGardenBoost);
  const [boostTokens, setBoostTokens] = React.useState<GardenBoostToken[]>([]);
  const previousActivity = React.useRef(moves);
  const tokenId = React.useRef(0);
  const collectedTokenIds = React.useRef<Set<number>>(new Set());

  // Foundations drive completion, while ordinary play keeps advancing the border.
  const totalFoundationCards = foundation.reduce((sum, pile) => sum + pile.length, 0);
  const foundationProgress = totalFoundationCards / 52;
  const activityCount = moves;
  const activityProgress = activityCount === 0 ? 0 : Math.min(0.98, 0.04 + activityCount / 135);
  const boostProgress = Math.min(0.35, gardenBoosts * 0.025);
  const progress = Math.min(1, Math.max(foundationProgress, activityProgress) + boostProgress);
  const growthEventCount = Math.min(POINT_BLOOMS.length, activityCount + gardenBoosts);

  React.useEffect(() => {
    if (activityCount < previousActivity.current) {
      previousActivity.current = activityCount;
      collectedTokenIds.current.clear();
      setBoostTokens([]);
      return;
    }

    if (activityCount <= previousActivity.current) return;

    const bubbleType: GardenBoostToken['type'] = Math.random() > 0.5 ? 'sun' : 'water';
    const createdTokens: GardenBoostToken[] = [
      {
        id: tokenId.current++,
        type: bubbleType,
        x: 14 + Math.random() * 72,
        y: 10 + Math.random() * 26,
        midX: 0,
        endX: 0,
        duration: 14 + Math.random() * 6,
      },
    ].map((token) => {
      const drift = Math.random() > 0.5 ? 1 : -1;
      const midX = Math.max(8, Math.min(92, token.x + drift * (5 + Math.random() * 8)));
      const endX = Math.max(8, Math.min(92, token.x - drift * (3 + Math.random() * 7)));
      return { ...token, midX, endX };
    });

    previousActivity.current = activityCount;
    setBoostTokens((tokens) => [...tokens.slice(-8), ...createdTokens]);
  }, [activityCount]);

  const collectBoostToken = (id: number) => {
    if (collectedTokenIds.current.has(id)) return;
    collectedTokenIds.current.add(id);
    popGardenBoost();
    setBoostTokens((tokens) => tokens.filter((token) => token.id !== id));
  };

  // Stagger plant visibility based on progress
  const getPlantProgress = (plantDelay: number) => {
    const threshold = plantDelay;
    const plantProgress = Math.max(0, Math.min(1, (progress - threshold) / 0.1));
    return plantProgress;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Sky gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 7%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 25%), linear-gradient(180deg, #DDEFF7 0%, #EEF8EE 38%, #C9E7C5 100%)',
        }}
      />

      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: '#7FA86A',
        }}
      />

      <BritishGardenDetails progress={progress} />

      {MATURE_BORDER_MASSES.map((mass) => {
        const massProgress = Math.max(0, Math.min(1, (progress - mass.delay) / 0.12));
        if (massProgress <= 0) return null;
        return (
          <motion.div
            key={mass.id}
            style={{
              position: 'absolute',
              left: `${mass.x}%`,
              top: `${mass.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: massProgress }}
          >
            <BorderMassSVG progress={massProgress} bloom={mass.bloom} width={mass.width} height={mass.height} />
          </motion.div>
        );
      })}

      {/* First growth stage: clear sprouts immediately after play begins. */}
      {progress > 0 && SPROUTS.map((sprout) => {
        const sproutProgress = Math.min(1, progress / 0.12);
        return (
          <motion.div
            key={sprout.id}
            style={{
              position: 'absolute',
              left: `${sprout.x}%`,
              top: `${sprout.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: sproutProgress, y: 0 }}
            transition={{ duration: 0.35, delay: sprout.id * 0.025 }}
          >
            <SproutSVG progress={sproutProgress} size={sprout.size} />
          </motion.div>
        );
      })}

      {POINT_BLOOMS.slice(0, growthEventCount).map((bloom) => (
        <motion.div
          key={bloom.id}
          style={{
            position: 'absolute',
            left: `${bloom.x}%`,
            top: `${bloom.y}%`,
            transform: 'translate(-50%, -100%)',
            zIndex: 2,
          }}
          initial={{ opacity: 0, scale: 0, y: 8 }}
          animate={{ opacity: 0.92, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <PointBloomSVG color={bloom.color} size={bloom.size} />
        </motion.div>
      ))}

      {/* Plants */}
      {PLANTS.map((plant) => {
        const plantProgress = getPlantProgress(plant.delay);
        if (plantProgress <= 0) return null;

        return (
          <motion.div
            key={plant.id}
            style={{
              position: 'absolute',
              left: `${plant.x}%`,
              top: `${plant.y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: plantProgress }}
          >
            {plant.type === 'flower' && <FlowerSVG color={plant.color} size={plant.size} progress={plantProgress} />}
            {plant.type === 'tree' && <TreeSVG color={plant.color} size={plant.size} progress={plantProgress} />}
            {plant.type === 'bush' && <BushSVG color={plant.color} size={plant.size} progress={plantProgress} />}
            {plant.type === 'grass' && <GrassSVG color={plant.color} size={plant.size} progress={plantProgress} />}
            {plant.type === 'spire' && <SpireSVG color={plant.color} size={plant.size} progress={plantProgress} />}
            {plant.type === 'orchid' && <OrchidSVG color={plant.color} size={plant.size} progress={plantProgress} />}
          </motion.div>
        );
      })}

      {progress > 0.08 && (
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '76%',
            transform: 'translate(-50%, -100%)',
            zIndex: 3,
            filter: 'drop-shadow(0 8px 12px rgba(42, 73, 46, 0.16))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.min(1, progress * 3) }}
        >
          <CenterpieceFlowerSVG progress={progress} />
        </motion.div>
      )}

      {/* Pop-up boosts: play grows steadily; tapping these accelerates it. */}
      {boostTokens.map((token) => (
        <motion.button
          key={token.id}
          type="button"
          aria-label={token.type === 'sun' ? 'Collect sunshine' : 'Collect water'}
          onPointerDown={(event) => {
            event.stopPropagation();
            collectBoostToken(token.id);
          }}
          onClick={(event) => {
            event.stopPropagation();
            collectBoostToken(token.id);
          }}
          onAnimationComplete={() => collectBoostToken(token.id)}
          style={{
            position: 'absolute',
            width: 44,
            height: 44,
            border: 'none',
            borderRadius: '50%',
            background: token.type === 'sun'
              ? 'radial-gradient(circle, rgba(255,236,120,0.95) 0%, rgba(255,171,0,0.8) 65%, rgba(255,171,0,0) 72%)'
              : 'radial-gradient(circle, rgba(179,229,252,0.95) 0%, rgba(41,182,246,0.75) 62%, rgba(41,182,246,0) 72%)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(27, 94, 32, 0.2))',
            zIndex: 30,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.35, left: `${token.x}%`, top: `${token.y}%` }}
          animate={{
            opacity: [0, 1, 1, 0.95, 0.85],
            scale: [0.35, 1.03, 0.98, 1.02, 0.96],
            left: [`${token.x}%`, `${token.midX}%`, `${token.endX}%`],
            top: [`${token.y}%`, `${Math.max(token.y + 7, 34)}%`, `${Math.max(token.y + 16, 50)}%`, '65%'],
          }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.82 }}
          transition={{
            duration: token.duration,
            ease: 'easeInOut',
            left: { duration: token.duration, ease: 'easeInOut' },
            top: { duration: token.duration, ease: 'easeInOut' },
            scale: { duration: token.duration, ease: 'easeInOut' },
            opacity: { duration: token.duration, ease: 'easeInOut' },
          }}
        >
          <span style={{ fontSize: token.type === 'sun' ? 26 : 24, lineHeight: '44px' }}>
            {token.type === 'sun' ? '☀️' : '💧'}
          </span>
        </motion.button>
      ))}

      {[
        { x: 20, y: 62, threshold: 0.22, dx: 24, dy: -16, delay: 0 },
        { x: 72, y: 58, threshold: 0.34, dx: -26, dy: -14, delay: 1.2 },
        { x: 44, y: 51, threshold: 0.48, dx: 18, dy: -18, delay: 0.6 },
        { x: 84, y: 70, threshold: 0.58, dx: -22, dy: -12, delay: 1.8 },
        { x: 13, y: 72, threshold: 0.68, dx: 20, dy: -15, delay: 2.4 },
        { x: 58, y: 66, threshold: 0.78, dx: -18, dy: -20, delay: 3 },
        { x: 31, y: 58, threshold: 0.88, dx: 26, dy: -10, delay: 0.9 },
      ].map((bee, index) => progress > bee.threshold && (
        <motion.div
          key={index}
          style={{ position: 'absolute', top: `${bee.y}%`, left: `${bee.x}%`, zIndex: 3 }}
          animate={{ x: [0, bee.dx, 0], y: [0, bee.dy, 0], rotate: [0, 6, -4, 0] }}
          transition={{ duration: 6 + index * 0.6, repeat: Infinity, delay: bee.delay, ease: 'easeInOut' }}
        >
          <BeeSVG size={0.75 + (index % 3) * 0.08} />
        </motion.div>
      ))}
    </div>
  );
};

export default GardenBackground;
