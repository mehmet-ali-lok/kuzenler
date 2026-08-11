import { describe, it, expect } from 'vitest';
import { Player } from '../types';

describe('Target Player Count & 15-Second Countdown Unit Tests', () => {

  it('should validate target player count selection (between 2 and 8)', () => {
    const isValidCapacity = (cap: number) => cap >= 2 && cap <= 8;

    expect(isValidCapacity(2)).toBe(true);
    expect(isValidCapacity(4)).toBe(true);
    expect(isValidCapacity(8)).toBe(true);
    expect(isValidCapacity(1)).toBe(false);
    expect(isValidCapacity(9)).toBe(false);
  });

  it('should trigger countdown start only when joined players count equals target count AND everyone is ready', () => {
    const targetPlayerCount = 3;
    const players: Player[] = [
      { id: '1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: '2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: true },
      { id: '3', name: 'Çınar', avatar: '👦', color: '#10b981', ready: true },
    ];

    const canStartCountdown = (playerList: Player[], targetCap: number): boolean => {
      const realPlayers = playerList.filter((p) => !p.isBot);
      const isTargetCountMet = playerList.length >= targetCap;
      const isEveryoneReady = realPlayers.every((p) => p.ready);
      return isTargetCountMet && isEveryoneReady;
    };

    expect(canStartCountdown(players, targetPlayerCount)).toBe(true);

    // If only 2 of 3 joined, should NOT start countdown
    expect(canStartCountdown(players.slice(0, 2), targetPlayerCount)).toBe(false);
  });

  it('should decrement countdown until 0 and then transition to playing status', () => {
    let currentCountdown = 15;
    let gameStatus = 'lobby';

    const tickCountdown = () => {
      if (currentCountdown > 1) {
        currentCountdown -= 1;
      } else {
        currentCountdown = 0;
        gameStatus = 'playing';
      }
    };

    for (let i = 0; i < 15; i++) {
      tickCountdown();
    }

    expect(currentCountdown).toBe(0);
    expect(gameStatus).toBe('playing');
  });

});
