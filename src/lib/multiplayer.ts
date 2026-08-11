import { MonopolyGameState, UnoGameState } from '@/types';

type GameType = 'monopoly' | 'uno';

export class RoomBroadcaster {
  private channel: BroadcastChannel | null = null;
  private channelName: string;
  private gameType: GameType;
  private roomId: string;
  private onStateReceived?: (state: unknown) => void;
  private pollInterval: NodeJS.Timeout | null = null;
  private lastUpdatedAt: number = 0;

  constructor(gameType: GameType, roomId: string, onStateReceived?: (state: unknown) => void) {
    this.gameType = gameType;
    this.roomId = roomId.toUpperCase();
    this.channelName = `kuzenler_${gameType}_${this.roomId}`;
    this.onStateReceived = onStateReceived;

    // 1. Same-device multi-tab BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(this.channelName);
      this.channel.onmessage = (event) => {
        if (event.data && this.onStateReceived) {
          this.onStateReceived(event.data);
        }
      };
    }

    // 2. Cross-device Server API polling every 1.5 seconds
    this.startServerPolling();
  }

  private startServerPolling() {
    this.pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms?game=${this.gameType}&roomId=${this.roomId}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.found && data.updatedAt > this.lastUpdatedAt) {
          this.lastUpdatedAt = data.updatedAt;
          if (this.onStateReceived) {
            this.onStateReceived(data.gameState);
          }
        }
      } catch (e) {
        // Silent error handling
      }
    }, 1500);
  }

  public async broadcast(state: MonopolyGameState | UnoGameState) {
    this.lastUpdatedAt = Date.now();

    // Broadcast to same-device tabs
    if (this.channel) {
      this.channel.postMessage(state);
    }

    // Broadcast globally to server room store
    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          game: this.gameType,
          roomId: this.roomId,
          gameState: state,
        }),
      });
    } catch (e) {
      console.error('Server room update error:', e);
    }
  }

  public destroy() {
    if (this.channel) {
      this.channel.close();
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }
}
