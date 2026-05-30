import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { FOUNDATION_SUITS, PileRef, Suit } from '../engine/types';
import { CardFace } from './Card';

export const Foundation: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const foundation = useGameStore((s) => s.foundation);
  const selectedCard = useGameStore((s) => s.selectedCard);
  const selectCard = useGameStore((s) => s.selectCard);
  const clearSelection = useGameStore((s) => s.clearSelection);
  const moveCard = useGameStore((s) => s.moveCard);

  const suitSymbols: Record<Suit, string> = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
  const suitColors: Record<Suit, string> = {
    hearts: '#E53935',
    diamonds: '#E53935',
    clubs: '#212121',
    spades: '#212121',
  };

  const handleTap = (index: number) => {
    const pileRef: PileRef = { type: 'foundation', index };
    const pile = foundation[index];

    if (selectedCard) {
      const src = selectedCard.pile;
      if (src.type === 'foundation' && src.index === index) {
        clearSelection();
        return;
      }

      if (selectedCard.cards.length === 1) {
        const moved = moveCard(src, pileRef, selectedCard.cards.map(c => c.id));
        if (moved) {
          clearSelection();
          return;
        }
      }
    }

    if (pile.length > 0) {
      selectCard(pileRef, pile.length - 1);
      return;
    }

    clearSelection();
  };

  return (
    <motion.div
      style={{
        display: 'flex',
        gap: 'clamp(5px, 1.3vw, 10px)',
        alignItems: 'flex-start',
        flexShrink: 1,
      }}
    >
      {foundation.map((pile, index) => {
        const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
        const isSelected = selectedCard?.pile.type === 'foundation' && selectedCard.pile.index === index;
        const isHighlighted = selectedCard !== null;
        const slotSuit = FOUNDATION_SUITS[index];
        const slotColor = suitColors[slotSuit];

        return (
          <motion.div
            key={index}
            onClick={() => handleTap(index)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: 'var(--card-width)',
              height: 'var(--card-height)',
              borderRadius: 'var(--card-radius)',
              background: isHighlighted
                ? `linear-gradient(135deg, ${slotColor}18 0%, rgba(255,255,255,0.85) 100%)`
                : `linear-gradient(135deg, ${slotColor}10 0%, rgba(255,255,255,0.6) 100%)`,
              border: isHighlighted
                ? isSelected
                  ? '2px solid #FFD600'
                  : `2px dashed ${slotColor}AA`
                : `2px dashed ${slotColor}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)',
              transition: 'border 0.2s, background 0.2s',
            }}
          >
            {topCard ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CardFace card={topCard} compact={compact} isSelected={isSelected} />
              </motion.div>
            ) : (
              <div style={{ fontSize: compact ? 18 : 28, opacity: 0.35, color: slotColor }}>{suitSymbols[slotSuit]}</div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Foundation;
