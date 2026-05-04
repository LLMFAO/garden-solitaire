import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, Suit } from '../engine/types';
import SuitHeart from '../assets/SuitHeart';
import SuitDiamond from '../assets/SuitDiamond';
import SuitClub from '../assets/SuitClub';
import SuitSpade from '../assets/SuitSpade';

interface CardProps {
  card: CardType;
  offsetY?: number;
  isSelected?: boolean;
  isSelectable?: boolean;
  onTap?: () => void;
  onDoubleTap?: () => void;
  compact?: boolean;
}

const suitSymbols: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const suitColors: Record<Suit, string> = {
  hearts: '#E53935',
  diamonds: '#E53935',
  clubs: '#212121',
  spades: '#212121',
};

const suitSvgs: Record<Suit, React.FC<{ size?: number; color?: string }>> = {
  hearts: SuitHeart,
  diamonds: SuitDiamond,
  clubs: SuitClub,
  spades: SuitSpade,
};

export const CardBack: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <motion.div
    style={{
      width: 'var(--card-width)',
      height: 'var(--card-height)',
      borderRadius: 'var(--card-radius)',
      background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 50%, #2E7D32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-card)',
      border: '2px solid rgba(255,255,255,0.3)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Leaf pattern */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 8%),
          radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 8%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 6%)
        `,
        backgroundSize: '30px 30px',
      }}
    />
    <div
      style={{
        width: '55%',
        height: '55%',
        borderRadius: '50%',
        border: '2px dashed rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <span style={{ fontSize: compact ? 24 : 40, filter: 'brightness(1.2)' }}>🌿</span>
    </div>
  </motion.div>
);

export const CardFace: React.FC<{ card: CardType; compact?: boolean; isSelected?: boolean }> = ({ card, compact, isSelected }) => {
  const color = suitColors[card.suit];
  const SuitSvg = suitSvgs[card.suit];
  const rankSize = compact ? 12 : 13;
  const cornerSuitSize = compact ? 11 : 11;

  return (
    <motion.div
      style={{
        width: compact ? 'var(--card-width)' : 'var(--card-width)',
        height: compact ? 'var(--card-height)' : 'var(--card-height)',
        borderRadius: 'var(--card-radius)',
        background: isSelected
          ? 'linear-gradient(180deg, #ffffff 0%, #FFFDE7 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #F1F8E9 100%)',
        boxShadow: isSelected
          ? '0 0 0 3px #FFD600, 0 6px 20px rgba(27, 94, 32, 0.2)'
          : 'var(--shadow-card)',
        border: isSelected ? '2px solid #FFD600' : '2px solid rgba(129, 199, 132, 0.3)',
        position: 'relative',
        transition: 'box-shadow 0.15s, border 0.15s',
        overflow: 'hidden',
      }}
      animate={isSelected ? { scale: 1.05, y: -4 } : { scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* top-left corner */}
      <div
        style={{
          position: 'absolute',
          top: compact ? 3 : 6,
          left: compact ? 4 : 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: rankSize, fontWeight: 900, color, lineHeight: 1 }}>{card.rank}</span>
        <span style={{ fontSize: cornerSuitSize, color, lineHeight: 1 }}>{suitSymbols[card.suit]}</span>
      </div>

      {/* center suit — only for non-compact */}
      {!compact && (
        <div
          style={{
            position: 'absolute',
            inset: '20px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <SuitSvg size={22} color={color} />
        </div>
      )}

      {/* bottom-right corner */}
      <div
        style={{
          position: 'absolute',
          right: compact ? 4 : 6,
          bottom: compact ? 3 : 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
          transform: 'rotate(180deg)',
          transformOrigin: 'center',
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: rankSize, fontWeight: 900, color, lineHeight: 1 }}>{card.rank}</span>
        <span style={{ fontSize: cornerSuitSize, color, lineHeight: 1 }}>{suitSymbols[card.suit]}</span>
      </div>
    </motion.div>
  );
};

export const CardComponent: React.FC<CardProps> = ({
  card,
  offsetY = 0,
  isSelected = false,
  isSelectable = false,
  onTap,
  onDoubleTap,
  compact,
}) => {
  const [lastTap, setLastTap] = React.useState(0);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTap < 300) {
      onDoubleTap?.();
    } else {
      onTap?.();
    }
    setLastTap(now);
  };

  return (
    <motion.div
      onClick={handleTap}
      onTouchStart={(e) => e.stopPropagation()}
      animate={{
        y: offsetY,
        zIndex: isSelected ? 200 : offsetY + 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        cursor: isSelectable ? 'pointer' : 'default',
        touchAction: 'none',
        zIndex: isSelected ? 200 : offsetY + 1,
      }}
    >
      {card.faceUp ? (
        <CardFace card={card} compact={compact} isSelected={isSelected} />
      ) : (
        <CardBack compact={compact} />
      )}
    </motion.div>
  );
};

export default CardComponent;
