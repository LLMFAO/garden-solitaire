import { Move } from './types';

export function calculateMoveScore(move: Move): number {
  const { from, to } = move;

  if (to.type === 'foundation') {
    if (from.type === 'tableau') return 10;
    if (from.type === 'waste') return 10;
    return 10;
  }

  if (to.type === 'tableau') {
    if (from.type === 'foundation') return -15;
    if (from.type === 'waste') return 5;
    if (from.type === 'tableau') return 5;
  }

  return 0;
}

export function calculateTimeBonus(timeSeconds: number): number {
  // Bonus for finishing under 5 minutes
  const maxTime = 300;
  if (timeSeconds >= maxTime) return 0;
  return Math.floor((maxTime - timeSeconds) / 10) * 5;
}

export function calculateFinalScore(baseScore: number, timeSeconds: number, moves: number): number {
  const timeBonus = calculateTimeBonus(timeSeconds);
  const movePenalty = Math.max(0, (moves - 100) * 2);
  return Math.max(0, baseScore + timeBonus - movePenalty);
}
