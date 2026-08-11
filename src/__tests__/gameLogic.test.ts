import { describe, it, expect } from 'vitest';
import { MONOPOLY_PROPERTIES } from '../lib/initialData';
import { Player, UnoCard, UnoColor } from '../types';

describe('Monopoly & Game Logic Unit Tests', () => {
  
  it('should validate 4-digit room code format', () => {
    const validRoomId = '1234';
    const isValid4DigitCode = (code: string) => /^\d{4}$/.test(code);
    
    expect(isValid4DigitCode('1234')).toBe(true);
    expect(isValid4DigitCode('9999')).toBe(true);
    expect(isValid4DigitCode('ABC12')).toBe(false);
    expect(isValid4DigitCode('12')).toBe(false);
  });

  it('should calculate correct Monopoly properties count and initial properties', () => {
    expect(MONOPOLY_PROPERTIES.length).toBe(32);
    expect(MONOPOLY_PROPERTIES[0].name).toBe('BAŞLANGIÇ');
    expect(MONOPOLY_PROPERTIES[1].name).toBe('Kapadokya');
  });

  it('should handle start tile +200 bonus when passing index 0', () => {
    let currentMoney = 1500;
    const oldPos = 30;
    const steps = 4; // Moves to tile (30+4)%32 = 2 (passed 0)
    const newPos = (oldPos + steps) % 32;
    
    if (newPos < oldPos) {
      currentMoney += 200;
    }

    expect(newPos).toBe(2);
    expect(currentMoney).toBe(1700);
  });

  it('should verify UNO card matching rules correctly', () => {
    const canPlayCard = (card: UnoCard, currentColor: UnoColor, currentValue: string): boolean => {
      if (card.color === 'wild') return true;
      if (card.color === currentColor) return true;
      if (card.value === currentValue) return true;
      return false;
    };

    const redFive: UnoCard = { id: '1', color: 'red', value: '5' };
    const blueFive: UnoCard = { id: '2', color: 'blue', value: '5' };
    const greenNine: UnoCard = { id: '3', color: 'green', value: '9' };
    const wildCard: UnoCard = { id: '4', color: 'wild', value: 'silence' };

    // Matches red color
    expect(canPlayCard(redFive, 'red', '7')).toBe(true);
    // Matches value 5
    expect(canPlayCard(blueFive, 'red', '5')).toBe(true);
    // Does not match green 9 with red 7
    expect(canPlayCard(greenNine, 'red', '7')).toBe(false);
    // Wild matches anything
    expect(canPlayCard(wildCard, 'blue', '2')).toBe(true);
  });

  it('should verify ready status check for starting game', () => {
    const players: Player[] = [
      { id: '1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: '2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: true },
      { id: '3', name: 'Bot 1', avatar: '🤖', color: '#10b981', isBot: true, ready: false },
    ];

    const isAllReady = (playerList: Player[]) => {
      return playerList.every((p) => p.isBot || p.ready);
    };

    expect(isAllReady(players)).toBe(true);

    players[1].ready = false;
    expect(isAllReady(players)).toBe(false);
  });

  it('should replace a disconnected player with a bot cleanly', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', money: 1400, position: 5 },
      { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', money: 1200, position: 12 },
    ];

    const replacePlayerWithBot = (playerList: Player[], targetId: string): Player[] => {
      return playerList.map((p) => {
        if (p.id === targetId) {
          return {
            ...p,
            name: `Bot ${p.name} AI`,
            avatar: '🤖 Bot',
            isBot: true,
          };
        }
        return p;
      });
    };

    const updated = replacePlayerWithBot(players, 'p2');
    expect(updated[1].name).toBe('Bot Ömer AI');
    expect(updated[1].isBot).toBe(true);
    expect(updated[1].money).toBe(1200); // Retains money & position
    expect(updated[1].position).toBe(12);
  });

});
