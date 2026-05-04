import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PileRef } from '../engine/types';
import { isTableauSequence } from '../engine/moves';
import { CardComponent } from './Card';

export const Tableau: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const tableau = useGameStore((s) => s.tableau);
  const selectedCard = useGameStore((s) => s.selectedCard);
  const selectCard = useGameStore((s) => s.selectCard);
  const clearSelection = useGameStore((s) => s.clearSelection);
  const moveCard = useGameStore((s) => s.moveCard);
  const autoMoveCard = useGameStore((s) => s.autoMoveCard);

  const handleCardTap = (colIndex: number, cardIndex: number) => {
    const pile = tableau[colIndex];
    const card = pile[cardIndex];

    if (!card.faceUp) {
      // Face-down card tapped - just clear selection
      clearSelection();
      return;
    }

    // Check if this card is the start of a valid sequence (can be moved)
    const sequence = pile.slice(cardIndex);
    const isValidSequence = isTableauSequence(sequence);

    if (!isValidSequence) {
      clearSelection();
      return;
    }

    // If a card is already selected...
    if (selectedCard) {
      const src = selectedCard.pile;

      // Tapping the same card = deselect
      if (src.type === 'tableau' && src.index === colIndex && selectedCard.cardIndex === cardIndex) {
        clearSelection();
        return;
      }

      // Tapping a different location = try to move selected card there
      const dest: PileRef = { type: 'tableau', index: colIndex };
      const moved = moveCard(src, dest, selectedCard.cards.map(c => c.id));
      if (moved) {
        clearSelection();
        return;
      }

      // Move failed - select the new card instead (if valid)
      selectCard({ type: 'tableau', index: colIndex }, cardIndex);
      return;
    }

    // No card selected - select this one
    selectCard({ type: 'tableau', index: colIndex }, cardIndex);
  };

  const handleColumnTap = (colIndex: number) => {
    // Empty column tapped
    if (tableau[colIndex].length > 0) return; // Not empty, card handler took it

    if (selectedCard) {
      const src = selectedCard.pile;
      const dest: PileRef = { type: 'tableau', index: colIndex };
      const moved = moveCard(src, dest, selectedCard.cards.map(c => c.id));
      if (moved) {
        clearSelection();
      }
    }
  };

  const handleDoubleTap = (colIndex: number) => {
    // Double-tap top card = auto-move to best destination
    autoMoveCard({ type: 'tableau', index: colIndex });
    clearSelection();
  };

  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(6px, 2vw, 14px)',
        padding: '0 8px',
        width: '100%',
        marginTop: 12,
      }}
    >
      {tableau.map((pile, colIndex) => (
        <motion.div
          key={colIndex}
          style={{
            width: 'var(--card-width)',
            minHeight: '300px',
            position: 'relative',
            borderRadius: 'var(--card-radius)',
            border: selectedCard?.pile.type === 'tableau' && selectedCard?.pile.index === colIndex
              ? '2px dashed var(--accent-sun)'
              : '2px dashed rgba(139, 201, 228, 0.3)',
            background: selectedCard?.pile.type === 'tableau' && selectedCard?.pile.index === colIndex
              ? 'rgba(255, 23, 68, 0.15)'
              : 'rgba(255,255,255,0.5)',
            transition: 'border 0.2s, background 0.2s',
          }}
          onClick={() => handleColumnTap(colIndex)}
        >
          {pile.map((card, cardIndex) => {
            const isTop = cardIndex === pile.length - 1;
            const isSelected = selectedCard?.pile.type === 'tableau'
              && selectedCard?.pile.index === colIndex
              && selectedCard?.cardIndex === cardIndex;

            // A card is selectable if it's face-up and either on top OR starts a valid sequence
            const sequence = pile.slice(cardIndex);
            const isSelectable = card.faceUp && isTableauSequence(sequence);

            return (
              <CardComponent
                key={card.id}
                card={card}
                offsetY={cardIndex * 22}
                isSelected={isSelected}
                isSelectable={isSelectable}
                onTap={() => handleCardTap(colIndex, cardIndex)}
                onDoubleTap={() => isTop && handleDoubleTap(colIndex)}
                compact={compact}
              />
            );
          })}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Tableau;
