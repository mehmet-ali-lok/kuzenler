import { MonopolyGameState, UnoGameState } from '@/types';

type GameType = 'monopoly' | 'uno';

export class RoomBroadcaster {
  private channel: BroadcastChannel | null = null;
  private channelName: string;
  private onStateReceived?: (state: unknown) => void;

  constructor(gameType: GameType, roomId: string, onStateReceived?: (state: unknown) => void) {
    this.channelName = `kuzenler_${gameType}_${roomId}`;
    this.onStateReceived = onStateReceived;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(this.channelName);
      this.channel.onmessage = (event) => {
        if (event.data && this.onStateReceived) {
          this.onStateReceived(event.data);
        }
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent);
    }
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (event.key === this.channelName && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (this.onStateReceived) {
          this.onStateReceived(parsed);
        }
      } catch (e) {
        console.error('Storage sync parse error', e);
      }
    }
  };

  broadcast(state: MonopolyGameState | UnoGameState) {
    if (this.channel) {
      this.channel.postMessage(state);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.channelName, JSON.stringify(state));
      } catch (e) {
        console.error('Storage sync set error', e);
      }
    }
  }

  destroy() {
    if (this.channel) {
      this.channel.close();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
  }
}
