export type TabType = 'home' | 'monopoly' | 'uno';

export type UserRole = 'guest' | 'duru' | 'omer' | 'cinar' | 'admin';

export interface UserSession {
  role: UserRole;
  name: string;
}

export interface KuzenProfile {
  id: 'duru' | 'omer' | 'cinar';
  name: string;
  title: string;
  age: number;
  avatar: string; // Base64 or Image URL
  themeColor: string;
  bgGradient: string;
  bio: string;
  hobbies: string[];
  favoriteGames: string[];
  quote: string;
  badges: Array<{ icon: string; label: string }>;
}

export interface SharedPhoto {
  id: string;
  url: string; // Base64 or Image URL
  title: string;
  uploadedBy: string;
  date: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isBot?: boolean;
  money?: number;
  position?: number;
  inJail?: boolean;
  jailTurns?: number;
  isBankrupt?: boolean;
  cards?: UnoCard[];
  penaltiesCount?: number;
}

export type PropertyType = 'turkey' | 'world' | 'station' | 'utility' | 'special';

export interface MonopolyProperty {
  id: number;
  name: string;
  subtitle?: string;
  type: PropertyType;
  price: number;
  rent: number;
  houseRent?: number[];
  housePrice?: number;
  colorGroup?: string;
  flag?: string;
  ownerId?: string | null;
  houses?: number;
  isMortgaged?: boolean;
  description?: string;
}

export interface MonopolyGameState {
  roomId: string;
  players: Player[];
  properties: MonopolyProperty[];
  currentPlayerIndex: number;
  dice: [number, number];
  isDiceRolled: boolean;
  gameStatus: 'lobby' | 'playing' | 'ended';
  log: string[];
  winnerId?: string;
  freeParkingPool: number;
}

export type UnoColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

export type UnoValue = 
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw2'
  | 'wild' | 'wild_draw4'
  | 'silence'
  | 'mega_draw_all'
  | 'hand_swap'
  | 'kuzen_curse'
  | 'lock_color';

export interface UnoCard {
  id: string;
  color: UnoColor;
  value: UnoValue;
  label?: string;
}

export interface UnoGameState {
  roomId: string;
  players: Player[];
  drawDeck: UnoCard[];
  discardPile: UnoCard[];
  currentColor: UnoColor;
  currentValue: UnoValue;
  currentPlayerIndex: number;
  direction: 1 | -1;
  gameStatus: 'lobby' | 'playing' | 'ended';
  activePenalty?: string | null;
  log: string[];
  winnerId?: string;
  unoDeclared: Record<string, boolean>;
}
