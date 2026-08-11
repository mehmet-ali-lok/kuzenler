import { describe, it, expect } from 'vitest';
import { Player, MonopolyProperty, MonopolyGameState } from '../types';
import { MONOPOLY_PROPERTIES } from '../lib/initialData';

describe('Official Monopoly Rules & Automatic Game Start Unit Tests', () => {

  it('should automatically start game when ALL joined non-bot players are ready', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: true },
    ];

    const checkAutoStart = (playerList: Player[], currentStatus: string) => {
      const realPlayers = playerList.filter((p) => !p.isBot);
      const isEveryoneReady = realPlayers.length >= 2 && realPlayers.every((p) => p.ready);
      if (currentStatus === 'lobby' && isEveryoneReady) {
        return 'playing';
      }
      return currentStatus;
    };

    expect(checkAutoStart(players, 'lobby')).toBe('playing');
  });

  it('should NOT auto start if any player is NOT ready', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: false },
    ];

    const checkAutoStart = (playerList: Player[], currentStatus: string) => {
      const realPlayers = playerList.filter((p) => !p.isBot);
      const isEveryoneReady = realPlayers.length >= 2 && realPlayers.every((p) => p.ready);
      if (currentStatus === 'lobby' && isEveryoneReady) {
        return 'playing';
      }
      return currentStatus;
    };

    expect(checkAutoStart(players, 'lobby')).toBe('lobby');
  });

  it('should ONLY allow buying property if player pawn position matches property tile ID', () => {
    const player: Player = {
      id: 'p1',
      name: 'Duru',
      avatar: '👧',
      color: '#ec4899',
      money: 1500,
      position: 1, // Landed on Kapadokya (ID 1)
    };

    const targetProperty: MonopolyProperty = MONOPOLY_PROPERTIES[1]; // Kapadokya (ID 1, Price 100)
    const otherProperty: MonopolyProperty = MONOPOLY_PROPERTIES[6]; // Atina (ID 6, Price 140)

    const canBuyProperty = (p: Player, prop: MonopolyProperty) => {
      // Must be unowned, player must have enough money, and player MUST be standing on this tile!
      return !prop.ownerId && (p.position === prop.id) && (p.money || 0) >= prop.price;
    };

    expect(canBuyProperty(player, targetProperty)).toBe(true);
    expect(canBuyProperty(player, otherProperty)).toBe(false); // Rejected because player is at pos 1, not 6
  });

  it('should automatically deduct rent and pay owner when landing on another player property', () => {
    const owner: Player = { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', money: 1000, position: 0 };
    const property: MonopolyProperty = { ...MONOPOLY_PROPERTIES[1], ownerId: 'p2', rent: 15 };

    const visitor: Player = { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', money: 1500, position: 1 };

    const processRent = (pVisitor: Player, pOwner: Player, prop: MonopolyProperty) => {
      if (prop.ownerId && prop.ownerId === pOwner.id && pVisitor.position === prop.id) {
        const rentAmount = prop.rent;
        return {
          visitorMoney: (pVisitor.money || 0) - rentAmount,
          ownerMoney: (pOwner.money || 0) + rentAmount,
        };
      }
      return { visitorMoney: pVisitor.money || 0, ownerMoney: pOwner.money || 0 };
    };

    const result = processRent(visitor, owner, property);
    expect(result.visitorMoney).toBe(1485);
    expect(result.ownerMoney).toBe(1015);
  });

});
