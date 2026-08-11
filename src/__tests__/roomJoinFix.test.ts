import { describe, it, expect } from 'vitest';
import { Player } from '../types';

describe('Room Joining & Player State Unit Tests', () => {

  it('should correctly append a new player to existing server room players list without overwriting', () => {
    const existingServerPlayers: Player[] = [
      { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: true },
    ];

    const myNewPlayer: Player = {
      id: 'p3_unique',
      name: 'Çınar',
      avatar: '👦',
      color: '#10b981',
      ready: false,
    };

    const joinRoom = (serverList: Player[], newPlayer: Player): Player[] => {
      // Filter out any stale player with same ID, then append
      return [...serverList.filter((p) => p.id !== newPlayer.id), newPlayer];
    };

    const updated = joinRoom(existingServerPlayers, myNewPlayer);

    expect(updated.length).toBe(3);
    expect(updated[2].id).toBe('p3_unique');
    expect(updated[2].name).toBe('Çınar');
  });

  it('should not auto-start game if the newly joined player is NOT ready', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: true },
      { id: 'p3', name: 'Çınar', avatar: '👦', color: '#10b981', ready: false }, // Newly joined
    ];

    const checkAutoStart = (playerList: Player[]): boolean => {
      const realPlayers = playerList.filter((p) => !p.isBot);
      return realPlayers.length >= 2 && realPlayers.every((p) => p.ready);
    };

    expect(checkAutoStart(players)).toBe(false);
  });

  it('should auto-start game ONLY when newly joined player also clicks ready', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Duru', avatar: '👧', color: '#ec4899', ready: true },
      { id: 'p2', name: 'Ömer', avatar: '👦', color: '#3b82f6', ready: true },
      { id: 'p3', name: 'Çınar', avatar: '👦', color: '#10b981', ready: true },
    ];

    const checkAutoStart = (playerList: Player[]): boolean => {
      const realPlayers = playerList.filter((p) => !p.isBot);
      return realPlayers.length >= 2 && realPlayers.every((p) => p.ready);
    };

    expect(checkAutoStart(players)).toBe(true);
  });

});
