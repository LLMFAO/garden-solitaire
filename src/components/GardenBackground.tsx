import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface GardenBoostToken {
  id: number;
  type: 'sun' | 'water';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetBloomId: number;
  duration: number;
}

interface BloomPoint {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const reveal = (progress: number, start: number, range = 0.16) => clamp01((progress - start) / range);

const BLOOM_COLORS = ['#F6EFE0', '#D9A7B4', '#B997C9', '#E8C2A4', '#F8F3E8', '#C47E92'];

const BLOOM_POINTS: BloomPoint[] = Array.from({ length: 88 }, (_, index) => ({
  id: index,
  x: 5 + ((index * 29) % 90),
  y: 72 + ((index * 19) % 24),
  color: BLOOM_COLORS[index % BLOOM_COLORS.length],
  size: 0.72 + (index % 5) * 0.08,
}));

const MEADOW_SPECKS = Array.from({ length: 70 }, (_, index) => ({
  id: index,
  x: 2 + ((index * 37) % 96),
  y: 67 + ((index * 23) % 29),
  opacity: 0.18 + (index % 5) * 0.035,
}));

const BORDER_MASSES = [
  { id: 1, x: 13, y: 92, start: 0.16, width: 92, height: 72, bloom: '#D39AAA' },
  { id: 2, x: 35, y: 90, start: 0.24, width: 106, height: 80, bloom: '#E8D6B8' },
  { id: 3, x: 63, y: 91, start: 0.34, width: 112, height: 84, bloom: '#B391CA' },
  { id: 4, x: 86, y: 93, start: 0.44, width: 88, height: 74, bloom: '#C97D91' },
  { id: 5, x: 24, y: 95, start: 0.58, width: 100, height: 88, bloom: '#F1E6C8' },
  { id: 6, x: 73, y: 96, start: 0.68, width: 104, height: 90, bloom: '#D8A8B8' },
];

const WildflowerSVG: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={28 * size} height={38 * size} viewBox="0 0 28 38" style={{ overflow: 'visible' }}>
    <path d="M14 38 C13.5 29 14 22 14 14" stroke="#496F45" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M14 29 C8 27 6 22 5 18 C10 20 13 24 14 29" fill="#6F8A59" opacity="0.82" />
    <path d="M14 25 C21 22 23 17 23 13 C18 16 15 20 14 25" fill="#789563" opacity="0.74" />
    <g opacity="0.92">
      <ellipse cx="14" cy="9" rx="2.7" ry="5" fill={color} />
      <ellipse cx="9.5" cy="13" rx="2.6" ry="4.6" fill={color} opacity="0.86" transform="rotate(-45 9.5 13)" />
      <ellipse cx="18.5" cy="13" rx="2.6" ry="4.6" fill={color} opacity="0.86" transform="rotate(45 18.5 13)" />
      <ellipse cx="11.5" cy="18" rx="2.3" ry="4" fill={color} opacity="0.74" transform="rotate(30 11.5 18)" />
      <ellipse cx="16.5" cy="18" rx="2.3" ry="4" fill={color} opacity="0.74" transform="rotate(-30 16.5 18)" />
      <circle cx="14" cy="14.3" r="2.1" fill="#D9C583" opacity="0.9" />
    </g>
  </svg>
);

const GrassClumpSVG: React.FC<{ progress: number; tint?: string; size?: number }> = ({
  progress,
  tint = '#59794B',
  size = 1,
}) => (
  <svg width={70 * size} height={46 * size} viewBox="0 0 70 46" style={{ overflow: 'visible' }}>
    <motion.g
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: progress, scaleY: progress }}
      transition={{ duration: 0.55, type: 'spring', stiffness: 150, damping: 18 }}
      style={{ transformOrigin: '35px 46px' }}
    >
      {Array.from({ length: 16 }, (_, index) => {
        const x = 5 + index * 4;
        const height = 18 + (index % 5) * 5;
        const bend = index % 2 === 0 ? -8 : 7;
        return (
          <path
            key={index}
            d={`M${x} 46 C${x + bend * 0.25} ${46 - height * 0.35} ${x + bend} ${46 - height * 0.72} ${x + bend * 0.45} ${46 - height}`}
            stroke={index % 3 === 0 ? '#6F8E59' : tint}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity={0.62 + (index % 4) * 0.07}
          />
        );
      })}
    </motion.g>
  </svg>
);

const FlowerBedSVG: React.FC<{ progress: number; bloom: string; width: number; height: number }> = ({
  progress,
  bloom,
  width,
  height,
}) => {
  const flowerCount = Math.max(5, Math.floor(width / 14));
  const flowers = Array.from({ length: flowerCount }, (_, i) => {
    const x = 12 + (i * 19) % (width - 24);
    const yBase = height - 4;
    const stemHeight = 18 + (i % 4) * 10;
    const type = i % 3; // 0 = tulip, 1 = daisy, 2 = lavender
    return { id: i, x, yBase, stemHeight, type };
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <motion.g
        initial={{ opacity: 0, scaleY: 0.25 }}
        animate={{ opacity: progress, scaleY: 0.35 + progress * 0.65 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 120, damping: 18 }}
        style={{ transformOrigin: `${width / 2}px ${height}px` }}
      >
        {/* Small pebbles along the base */}
        {Array.from({ length: Math.floor(width / 8) }, (_, i) => (
          <ellipse
            key={`pebble-${i}`}
            cx={6 + (i * 13) % (width - 12)}
            cy={height - 2 + (i % 3)}
            rx={2 + (i % 3)}
            ry={1.2 + (i % 2) * 0.6}
            fill={i % 2 === 0 ? '#9E8E7E' : '#B5A594'}
            opacity="0.55"
          />
        ))}

        {flowers.map((f) => {
          const topY = f.yBase - f.stemHeight;
          const sway = f.id % 2 === 0 ? -4 : 4;
          if (f.type === 0) {
            // Tulip
            return (
              <g key={`flower-${f.id}`}>
                <path
                  d={`M${f.x} ${f.yBase} C${f.x + sway * 0.3} ${f.yBase - f.stemHeight * 0.5} ${f.x} ${topY + 4} ${f.x} ${topY}`}
                  stroke="#4A7A3A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.85"
                />
                {/* Tulip leaves */}
                <path
                  d={`M${f.x} ${f.yBase - 4} C${f.x - 5} ${f.yBase - f.stemHeight * 0.35} ${f.x - 3} ${topY + 6} ${f.x - 1} ${topY + 8}`}
                  stroke="#5A8A4A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.7"
                />
                {/* Tulip bloom */}
                <g opacity="0.9">
                  <path d={`M${f.x} ${topY} C${f.x - 5.5} ${topY - 7} ${f.x - 5} ${topY - 12} ${f.x} ${topY - 14} C${f.x + 5} ${topY - 12} ${f.x + 5.5} ${topY - 7} ${f.x} ${topY}`} fill={bloom} />
                  <path d={`M${f.x} ${topY} C${f.x - 3.5} ${topY - 5} ${f.x - 3} ${topY - 9} ${f.x} ${topY - 10}`} fill={bloom} opacity="0.8" />
                  <path d={`M${f.x} ${topY} C${f.x + 3.5} ${topY - 5} ${f.x + 3} ${topY - 9} ${f.x} ${topY - 10}`} fill={bloom} opacity="0.8" />
                </g>
              </g>
            );
          } else if (f.type === 1) {
            // Daisy
            return (
              <g key={`flower-${f.id}`}>
                <path
                  d={`M${f.x} ${f.yBase} C${f.x + sway * 0.3} ${f.yBase - f.stemHeight * 0.5} ${f.x} ${topY + 4} ${f.x} ${topY}`}
                  stroke="#4A7A3A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.85"
                />
                {/* Daisy leaves */}
                <ellipse cx={f.x - 3} cy={f.yBase - f.stemHeight * 0.3} rx="3.5" ry="1.8" fill="#5A8A4A" opacity="0.65" transform={`rotate(-35 ${f.x - 3} ${f.yBase - f.stemHeight * 0.3})`} />
                <ellipse cx={f.x + 2} cy={f.yBase - f.stemHeight * 0.25} rx="3" ry="1.5" fill="#6A9A5A" opacity="0.6" transform={`rotate(25 ${f.x + 2} ${f.yBase - f.stemHeight * 0.25})`} />
                {/* Daisy petals */}
                <g opacity="0.92">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
                    <ellipse
                      key={`petal-${rot}`}
                      cx={f.x}
                      cy={topY}
                      rx="2.8"
                      ry="5"
                      fill="#F7F0E0"
                      transform={`rotate(${rot} ${f.x} ${topY})`}
                    />
                  ))}
                  <circle cx={f.x} cy={topY} r="2.2" fill="#E8C860" />
                </g>
              </g>
            );
          } else {
            // Lavender
            return (
              <g key={`flower-${f.id}`}>
                <path
                  d={`M${f.x} ${f.yBase} C${f.x + sway * 0.2} ${f.yBase - f.stemHeight * 0.5} ${f.x} ${topY + 6} ${f.x} ${topY}`}
                  stroke="#5A6A4A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
                {/* Lavender spike */}
                {Array.from({ length: 7 }, (_, j) => (
                  <ellipse
                    key={`spike-${j}`}
                    cx={f.x + (j % 2 === 0 ? -0.8 : 0.8)}
                    cy={topY + j * 2.8}
                    rx="1.6"
                    ry="1.4"
                    fill={bloom}
                    opacity="0.75"
                  />
                ))}
              </g>
            );
          }
        })}
      </motion.g>
    </svg>
  );
};

const SunTokenSVG: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
    <defs>
      <radialGradient id="sunTokenGradient" cx="50%" cy="42%" r="58%">
        <stop offset="0%" stopColor="#FFF4A8" />
        <stop offset="62%" stopColor="#E7AE2D" />
        <stop offset="100%" stopColor="#CB7B16" />
      </radialGradient>
    </defs>
    <circle cx="22" cy="22" r="13" fill="url(#sunTokenGradient)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
      <path
        key={rotation}
        d="M22 3 L25 11 L19 11 Z"
        fill="#F4CA54"
        opacity="0.88"
        transform={`rotate(${rotation} 22 22)`}
      />
    ))}
  </svg>
);

const WaterTokenSVG: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
    <defs>
      <linearGradient id="waterTokenGradient" x1="12" y1="4" x2="32" y2="40">
        <stop offset="0%" stopColor="#D8EFF4" />
        <stop offset="58%" stopColor="#7DB4C6" />
        <stop offset="100%" stopColor="#3E8194" />
      </linearGradient>
    </defs>
    <path
      d="M22 5 C15 15 10 22 10 29 C10 36 15 41 22 41 C29 41 34 36 34 29 C34 22 29 15 22 5Z"
      fill="url(#waterTokenGradient)"
    />
    <path d="M17 19 C15 23 15 29 18 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.56" />
  </svg>
);

const GardenSceneSVG: React.FC<{ progress: number }> = ({ progress }) => {
  const pathProgress = reveal(progress, 0.08);
  const structureProgress = reveal(progress, 0.54);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="gardenBackground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2F8F4" />
          <stop offset="44%" stopColor="#E9F4EC" />
          <stop offset="65%" stopColor="#A7CB8F" />
          <stop offset="100%" stopColor="#6F955E" />
        </linearGradient>
        <linearGradient id="gardenGravel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8DEC7" />
          <stop offset="100%" stopColor="#C8B997" />
        </linearGradient>
        <linearGradient id="gardenWater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8EC2D2" />
          <stop offset="54%" stopColor="#5F93AC" />
          <stop offset="100%" stopColor="#376D82" />
        </linearGradient>
        <filter id="gardenSoftShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0.6" dy="1.4" stdDeviation="1.2" floodColor="#2E4A30" floodOpacity="0.22" />
        </filter>
      </defs>

      <rect width="100" height="100" fill="url(#gardenBackground)" />
      <path d="M0 66.4 C16 68 31 66 45 68 C62 71 78 66 100 68 L100 100 L0 100Z" fill="#7EA769" opacity="0.42" />

      {Array.from({ length: 10 }, (_, index) => {
        const y = 60 + index * 3.8;
        return (
          <path
            key={`mown-${index}`}
            d={`M-6 ${y + 7} C18 ${y + 4.5} 34 ${y + 9.2} 55 ${y + 5.8} C75 ${y + 3} 88 ${y + 8.8} 106 ${y + 6}`}
            stroke="#DCE8C9"
            strokeWidth="0.6"
            fill="none"
            opacity="0.25"
          />
        );
      })}

      {MEADOW_SPECKS.map((speck) => (
        <circle
          key={speck.id}
          cx={speck.x}
          cy={speck.y}
          r={speck.id % 3 === 0 ? 0.18 : 0.12}
          fill="#E8F0D4"
          opacity={speck.opacity}
        />
      ))}

      <motion.g
        initial={false}
        animate={{ opacity: pathProgress, y: (1 - pathProgress) * 2 }}
        transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        filter="url(#gardenSoftShadow)"
      >
        <path
          d="M-5 80 C13 74 23 73 38 78 C52 83 63 82 78 75 C88 70 94 69 105 70 L105 78 C88 77 79 82 67 87 C53 93 39 89 27 83 C17 78 6 81 -5 87Z"
          fill="url(#gardenGravel)"
        />
        <path
          d="M-4 78 C13 72 24 72 39 76 C52 80 63 80 77 73 C88 68 96 68 104 69"
          stroke="#B7A884"
          strokeWidth="0.65"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        {Array.from({ length: 22 }, (_, index) => (
          <ellipse
            key={`path-stone-${index}`}
            cx={2 + index * 4.7}
            cy={80 + Math.sin(index * 0.9) * 3}
            rx="1.25"
            ry="0.42"
            fill="#F5ECD8"
            opacity="0.45"
          />
        ))}
      </motion.g>

      {/* Ground texture dots instead of skewed flowers */}
      {Array.from({ length: 50 }, (_, i) => {
        const x = 3 + ((i * 29) % 94);
        const y = 68 + ((i * 19) % 20);
        return (
          <circle
            key={`ground-dot-${i}`}
            cx={x}
            cy={y}
            r={i % 7 === 0 ? 0.55 : 0.35}
            fill={i % 5 === 0 ? '#B8D4A0' : '#A5C98E'}
            opacity="0.45"
          />
        );
      })
      }
      <motion.g
        initial={false}
        animate={{ opacity: structureProgress, y: (1 - structureProgress) * 3 }}
        transition={{ type: 'spring', stiffness: 95, damping: 16 }}
        filter="url(#gardenSoftShadow)"
      >
        <rect x="13" y="70" width="2.2" height="14" rx="0.6" fill="#8B5A3C" />
        <rect x="31" y="69" width="2.2" height="14" rx="0.6" fill="#8B5A3C" />
        <path d="M12 70 C18 65 26 65 34 69" stroke="#A46A42" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M15 69 C20 67 26 67 31 69" stroke="#D2A66E" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.75" />
      </motion.g>

      {/* Archway over pathway */}
      <motion.g
        initial={false}
        animate={{ opacity: structureProgress, y: (1 - structureProgress) * 2 }}
        transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        filter="url(#gardenSoftShadow)"
      >
        <rect x="13" y="78" width="2.2" height="22" rx="0.6" fill="#8B5A3C" />
        <rect x="31" y="78" width="2.2" height="22" rx="0.6" fill="#8B5A3C" />
        <path d="M12 78 C18 73 26 73 34 77" stroke="#A46A42" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M15 77 C20 75 26 75 31 77" stroke="#D2A66E" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.75" />
        <motion.path
          d="M14 84 C18 79 28 77 32 82"
          stroke="#557648"
          strokeWidth="1.1"
          fill="none"
          opacity="0.85"
          animate={{ pathLength: structureProgress }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </motion.g>
    </svg>
  );
};

export const GardenBackground: React.FC = () => {
  const foundation = useGameStore((s) => s.foundation);
  const moves = useGameStore((s) => s.moves);
  const gardenBoosts = useGameStore((s) => s.gardenBoosts);
  const popGardenBoost = useGameStore((s) => s.popGardenBoost);
  const [boostTokens, setBoostTokens] = React.useState<GardenBoostToken[]>([]);
  const [sproutedIds, setSproutedIds] = React.useState<Set<number>>(new Set());
  const previousActivity = React.useRef(moves);
  const tokenId = React.useRef(0);
  const collectedTokenIds = React.useRef<Set<number>>(new Set());

  const totalFoundationCards = foundation.reduce((sum, pile) => sum + pile.length, 0);
  const foundationProgress = totalFoundationCards / 52;
  const activityProgress = moves === 0 ? 0 : Math.min(0.96, 0.05 + moves / 145);
  const boostProgress = Math.min(0.32, gardenBoosts * 0.025);
  const progress = Math.min(1, Math.max(foundationProgress, activityProgress) + boostProgress);

  React.useEffect(() => {
    if (moves < previousActivity.current) {
      previousActivity.current = moves;
      collectedTokenIds.current.clear();
      setBoostTokens([]);
      setSproutedIds(new Set());
      return;
    }

    if (moves <= previousActivity.current) return;

    // Pick a bloom point that hasn't sprouted yet, in the bottom garden area
    const available = BLOOM_POINTS.filter((bp) => !sproutedIds.has(bp.id));
    if (available.length === 0) return;
    const targetBloom = available[Math.floor(Math.random() * available.length)];

    // Pick start position near upper middle
    const startX = 20 + Math.random() * 60;
    const startY = 18 + Math.random() * 22;

    const bubbleType: GardenBoostToken['type'] = Math.random() > 0.5 ? 'sun' : 'water';
    const createdTokens: GardenBoostToken[] = [
      {
        id: tokenId.current++,
        type: bubbleType,
        x: startX,
        y: startY,
        targetX: targetBloom.x,
        targetY: targetBloom.y,
        targetBloomId: targetBloom.id,
        duration: 7 + Math.random() * 4,
      },
    ];

    previousActivity.current = moves;
    setBoostTokens((tokens) => [...tokens.slice(-8), ...createdTokens]);
  }, [moves, sproutedIds]);

  const collectBoostToken = (id: number) => {
    if (collectedTokenIds.current.has(id)) return;
    collectedTokenIds.current.add(id);
    popGardenBoost();
    setBoostTokens((tokens) => tokens.filter((token) => token.id !== id));
    // Mark the bloom point as sprouted
    const token = boostTokens.find((t) => t.id === id);
    if (token) {
      setSproutedIds((prev) => new Set(prev).add(token.targetBloomId));
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <GardenSceneSVG progress={progress} />

      {[
        { id: 1, x: 7, y: 93, start: 0.02, size: 0.85, tint: '#5E7D4E' },
        { id: 2, x: 22, y: 91, start: 0.08, size: 0.75, tint: '#698A55' },
        { id: 3, x: 40, y: 92, start: 0.12, size: 0.8, tint: '#55764B' },
        { id: 4, x: 55, y: 93, start: 0.14, size: 0.76, tint: '#647F50' },
        { id: 5, x: 72, y: 91, start: 0.16, size: 0.8, tint: '#5E7D4E' },
        { id: 6, x: 85, y: 93, start: 0.18, size: 0.74, tint: '#698A55' },
        { id: 7, x: 93, y: 91, start: 0.1, size: 0.7, tint: '#55764B' },
      ].map((clump) => {
        const clumpProgress = reveal(progress, clump.start, 0.12);
        return (
          <motion.div
            key={clump.id}
            style={{
              position: 'absolute',
              left: `${clump.x}%`,
              top: `${clump.y}%`,
              transform: 'translate(-50%, -100%)',
              filter: 'drop-shadow(0 6px 8px rgba(38, 67, 40, 0.14))',
            }}
            initial={false}
            animate={{ opacity: clumpProgress }}
          >
            <motion.div
              animate={clumpProgress > 0.85 ? { y: [0, -1.5, 0], rotate: [0, 0.7, 0] } : undefined}
              transition={{ duration: 5.5 + clump.id * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GrassClumpSVG progress={clumpProgress} tint={clump.tint} size={clump.size} />
            </motion.div>
          </motion.div>
        );
      })}

      {BORDER_MASSES.map((mass) => {
        const massProgress = reveal(progress, mass.start, 0.18);
        if (massProgress <= 0) return null;
        return (
          <motion.div
            key={mass.id}
            style={{
              position: 'absolute',
              left: `${mass.x}%`,
              top: `${mass.y}%`,
              transform: 'translate(-50%, -100%)',
              filter: 'drop-shadow(0 8px 10px rgba(37, 62, 38, 0.16))',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: massProgress }}
          >
            <motion.div
              animate={massProgress > 0.92 ? { y: [0, -2, 0], rotate: [0, 0.45, -0.2, 0] } : undefined}
              transition={{ duration: 6.5 + mass.id * 0.45, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FlowerBedSVG progress={massProgress} bloom={mass.bloom} width={mass.width} height={mass.height} />
            </motion.div>
          </motion.div>
        );
      })}

      {BLOOM_POINTS.filter((bloom) => sproutedIds.has(bloom.id)).map((bloom) => (
        <motion.div
          key={bloom.id}
          style={{
            position: 'absolute',
            left: `${bloom.x}%`,
            top: `${bloom.y}%`,
            transform: 'translate(-50%, -100%)',
            filter: 'drop-shadow(0 3px 3px rgba(41, 69, 43, 0.12))',
          }}
          initial={{ opacity: 0, scale: 0.45, y: 7 }}
          animate={{ opacity: 0.92, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 18 }}
        >
          <WildflowerSVG color={bloom.color} size={bloom.size} />
        </motion.div>
      ))}

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
          style={{
            position: 'absolute',
            width: 44,
            height: 44,
            border: 'none',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.78)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 5px 10px rgba(44, 76, 46, 0.22))',
            zIndex: 30,
            transform: 'translate(-50%, -50%)',
            padding: 0,
          }}
          initial={{ opacity: 0, scale: 0.35, left: `${token.x}%`, top: `${token.y}%` }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.35, 1.03, 1, 0.2],
            left: [`${token.x}%`, `${token.targetX}%`],
            top: [`${token.y}%`, `${token.targetY}%`],
          }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.82 }}
          transition={{
            duration: token.duration,
            ease: 'easeInOut',
            left: { duration: token.duration, ease: 'easeInOut' },
            top: { duration: token.duration, ease: 'easeInOut' },
            scale: { duration: token.duration, ease: 'easeInOut' },
            opacity: { duration: token.duration, ease: 'easeInOut' },
          }}
          onAnimationComplete={() => collectBoostToken(token.id)}
        >
          {token.type === 'sun' ? <SunTokenSVG /> : <WaterTokenSVG />}
        </motion.button>
      ))}
    </div>
  );
};

export default GardenBackground;
