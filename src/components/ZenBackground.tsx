import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const ZEN_ROCKS = [
  { x: 15, y: 88, rx: 22, ry: 12, color: '#8A8278' },
  { x: 78, y: 85, rx: 28, ry: 14, color: '#7A756E' },
  { x: 50, y: 90, rx: 18, ry: 10, color: '#9A9288' },
  { x: 30, y: 86, rx: 15, ry: 9, color: '#857E76' },
  { x: 65, y: 87, rx: 20, ry: 11, color: '#8B857C' },
];

const BambooSVG: React.FC<{ height: number; segments: number; progress: number }> = ({
  height,
  segments,
  progress,
}) => {
  const segmentHeight = height / segments;
  const scale = 0.3 + progress * 0.7;

  return (
    <svg
      width={20 * scale}
      height={height * scale}
      viewBox={`0 0 20 ${height}`}
      style={{ overflow: 'visible' }}
    >
      {Array.from({ length: segments }, (_, i) => {
        const y = i * segmentHeight;
        const segmentProgress = Math.max(0, Math.min(1, (progress - i * 0.12) / 0.15));

        return (
          <React.Fragment key={i}>
            <motion.rect
              x={6}
              y={y + 2}
              width={8}
              height={segmentHeight - 4}
              fill="#5A6B4A"
              rx={1}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: segmentProgress, scaleY: segmentProgress }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{ transformOrigin: '10px ' + (y + segmentHeight / 2) + 'px' }}
            />
            {i < segments - 1 && (
              <motion.line
                x1={6}
                y1={y + segmentHeight}
                x2={14}
                y2={y + segmentHeight}
                stroke="#4A5B3A"
                strokeWidth={1.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: segmentProgress * 0.8 }}
                transition={{ duration: 0.3, delay: i * 0.08 + 0.2 }}
              />
            )}
          </React.Fragment>
        );
      })}
      <motion.path
        d={`M10 ${height} L10 ${height * 0.15}`}
        stroke="#4A5B3A"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: progress, opacity: progress }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ transformOrigin: '10px 30px' }}
      >
        <ellipse cx={-3} cy={height * 0.35} rx={6} ry={3} fill="#6A7B5A" transform="rotate(-30 -3 0)" opacity={0.85} />
        <ellipse cx={23} cy={height * 0.5} rx={7} ry={3} fill="#5A6B4A" transform="rotate(25 23 0)" opacity={0.8} />
        <ellipse cx={-2} cy={height * 0.65} rx={5} ry={2.5} fill="#7A8B6A" transform="rotate(-20 -2 0)" opacity={0.75} />
      </motion.g>
    </svg>
  );
};

const WaterRipple: React.FC<{ x: number; y: number; progress: number }> = ({ x, y, progress }) => {
  const scale = 0.3 + Math.min(0.9, progress * 1.2);
  const opacity = 0.3 + progress * 0.4;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale, opacity }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <svg width={120} height={60} viewBox="0 0 120 60" style={{ overflow: 'visible' }}>
        <ellipse cx={60} cy={30} rx={55} ry={25} fill="#7A9BAA" opacity={opacity} />
        <motion.ellipse
          cx={60}
          cy={30}
          rx={45}
          ry={20}
          fill="none"
          stroke="rgba(180, 210, 220, 0.4)"
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: progress, opacity: progress * 0.6 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.ellipse
          cx={60}
          cy={30}
          rx={35}
          ry={15}
          fill="none"
          stroke="rgba(180, 210, 220, 0.3)"
          strokeWidth={1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: progress, opacity: progress * 0.4 }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  );
};

const SandRakeLines: React.FC = () => (
  <svg
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '35%',
      pointerEvents: 'none',
    }}
    viewBox="0 0 100 35"
    preserveAspectRatio="none"
  >
    {[12, 15, 18, 21, 24, 27].map((y) => (
      <path
        key={y}
        d={`M 0 ${y} Q 25 ${y + (y % 2 === 0 ? 1.5 : -1.5)} 50 ${y} Q 75 ${y + (y % 2 === 0 ? -1.5 : 1.5)} 100 ${y}`}
        stroke="#C8BFB0"
        strokeWidth={0.3}
        fill="none"
        opacity={0.6}
      />
    ))}
  </svg>
);

const CherryPetal: React.FC<{ x: number; delay: number }> = ({ x, delay }) => {
  const startY = 85 + Math.random() * 10;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${startY}%`,
        zIndex: 5,
      }}
      initial={{ opacity: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.9, 0.8, 0],
        y: [-20, -120, -200],
        x: [0, 15, -10, 5],
        rotate: [0, 45, -30, 15],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg width={12} height={14} viewBox="0 0 12 14">
        <ellipse cx={6} cy={7} rx={5} ry={6} fill="#FFB7C5" opacity={0.88} />
        <ellipse cx={6} cy={5} rx={3} ry={4} fill="#FFC8D4" opacity={0.6} />
      </svg>
    </motion.div>
  );
};

export const ZenBackground: React.FC = () => {
  const foundation = useGameStore((s) => s.foundation);
  const totalFoundationCards = foundation.reduce((sum, pile) => sum + pile.length, 0);
  const progress = Math.min(1, totalFoundationCards / 52);

  const bambooData = [
    { x: 8, height: 180, segments: 6 },
    { x: 50, height: 200, segments: 7 },
    { x: 88, height: 140, segments: 5 },
  ];

  const petalData = [
    { x: 12, delay: 0 },
    { x: 28, delay: 1.2 },
    { x: 45, delay: 2.4 },
    { x: 62, delay: 0.8 },
    { x: 78, delay: 3.2 },
    { x: 35, delay: 1.8 },
    { x: 55, delay: 2.8 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #C8D4DB 0%, #D8E0E4 40%, #E8E0D0 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: '#C8BFB0',
        }}
      />

      <SandRakeLines />

      {ZEN_ROCKS.map((rock, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${rock.x}%`,
            bottom: `${100 - rock.y}%`,
            transform: 'translate(-50%, 50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring' }}
        >
          <svg width={rock.rx * 2} height={rock.ry * 2} viewBox={`0 0 ${rock.rx * 2} ${rock.ry * 2}`}>
            <ellipse cx={rock.rx} cy={rock.ry} rx={rock.rx} ry={rock.ry} fill={rock.color} />
          </svg>
        </motion.div>
      ))}

      {bambooData.map((bamboo, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${bamboo.x}%`,
            bottom: '35%',
            transform: 'translate(-50%, 0)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
        >
          <BambooSVG height={bamboo.height} segments={bamboo.segments} progress={progress} />
        </motion.div>
      ))}

      <WaterRipple x={45} y={78} progress={progress} />

      {petalData.map((petal, i) => (
        <CherryPetal key={i} x={petal.x} delay={petal.delay} />
      ))}
    </div>
  );
};

export default ZenBackground;