import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useHaptics } from '../hooks/useHaptics';
import { CardFace } from './Card';

export const StockWaste: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const stock = useGameStore((s) => s.stock);
  const waste = useGameStore((s) => s.waste);
  const drawFromStock = useGameStore((s) => s.drawFromStock);
  const selectedCard = useGameStore((s) => s.selectedCard);
  const selectCard = useGameStore((s) => s.selectCard);
  const clearSelection = useGameStore((s) => s.clearSelection);
  const autoMoveCard = useGameStore((s) => s.autoMoveCard);
  const { soft } = useHaptics();

  const drawMode = useGameStore((s) => s.drawMode);

  const cardW = 'var(--card-width)';
  const cardH = 'var(--card-height)';
  const wasteFanWidth = 'calc(var(--card-width) + clamp(24px, 8vw, 40px))';
  const wasteFanOffset = 'clamp(12px, 4vw, 18px)';

  const handleStockTap = () => {
    soft();
    clearSelection();
    drawFromStock();
  };

  const handleWasteTap = () => {
    if (waste.length === 0) return;

    if (selectedCard?.pile.type === 'waste') {
      clearSelection();
      return;
    }

    selectCard({ type: 'waste', index: 0 }, waste.length - 1);
  };

  const handleWasteDoubleTap = () => {
    if (waste.length > 0) {
      autoMoveCard({ type: 'waste', index: 0 });
      clearSelection();
    }
  };

  const isWasteSelected = selectedCard?.pile.type === 'waste';

  return (
    <motion.div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        flexShrink: 0,
      }}
    >
      {/* Stock pile - looks like a flower pot */}
      <motion.div
        onClick={handleStockTap}
        whileTap={{ scale: 0.92 }}
        style={{
          width: cardW,
          height: cardH,
          borderRadius: 'var(--card-radius)',
          background: 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 50%, #5D4037 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-card)',
          border: '2px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soil texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {stock.length > 0 ? (
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: compact ? 20 : 32, display: 'block' }}>🌱</span>
            <span style={{ fontSize: compact ? 9 : 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{stock.length}</span>
          </div>
        ) : waste.length > 0 ? (
          <span style={{ fontSize: compact ? 18 : 28, position: 'relative', zIndex: 1 }}>🔄</span>
        ) : (
          <span style={{ fontSize: compact ? 16 : 24, opacity: 0.5, position: 'relative', zIndex: 1 }}>✨</span>
        )}
      </motion.div>

      {/* Waste pile */}
      <motion.div
        style={{
          width: drawMode === 3 ? wasteFanWidth : cardW,
          height: cardH,
          position: 'relative',
          borderRadius: 'var(--card-radius)',
          border: isWasteSelected
            ? '2px solid #FFD600'
            : '2px dashed rgba(129, 199, 132, 0.4)',
          background: isWasteSelected
            ? 'rgba(255, 214, 0, 0.1)'
            : 'rgba(255,255,255,0.3)',
          cursor: waste.length > 0 ? 'pointer' : 'default',
          transition: 'border 0.2s, background 0.2s',
        }}
        onClick={handleWasteTap}
        onDoubleClick={handleWasteDoubleTap}
      >
        {waste.slice(-drawMode).map((card, i, visibleCards) => {
          const realIndex = waste.length - visibleCards.length + i;
          const isTop = realIndex === waste.length - 1;
          const offset = drawMode === 3 ? `calc(${i} * ${wasteFanOffset})` : 0;
          return (
            <motion.div
              key={card.id}
              style={{
                position: 'absolute',
                top: 0,
                left: offset,
                zIndex: realIndex,
              }}
              initial={false}
            >
              <motion.div
                animate={isTop && isWasteSelected ? { scale: 1.05, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  opacity: isTop ? 1 : 0.85,
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
              >
                <CardFace card={card} compact={compact} isSelected={isTop && isWasteSelected} />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default StockWaste;
