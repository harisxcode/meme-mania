export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'reviving';

export type Lane = -1 | 0 | 1;

export interface CharacterConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  quote: string;
  color: string;
  accentColor: string;
  cost: number;
  unlocked: boolean;
  avatarEmoji: string;
  perks: {
    speedBoost: number; // e.g. 1.05 = 5% faster
    coinMultiplier: number;
    magnetRadiusBonus: number;
    stumbleResistance: number;
    specialDescription: string;
  };
}

export type PowerUpType = 
  | 'much_speed' 
  | 'stonks' 
  | 'nyan_magnet' 
  | 'gigachad' 
  | 'this_is_fine' 
  | 'rickroll';

export interface PowerUpConfig {
  id: PowerUpType;
  name: string;
  memeSubtitle: string;
  description: string;
  icon: string;
  color: string;
  duration: number; // in seconds
  costToUpgrade: number;
  level: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  timeRemaining: number;
  duration: number;
}

export type ObstacleType = 
  | 'barrier_low'     // "Touch Grass" hedge/mower (jump over or dodge)
  | 'barrier_high'    // "Cringe Laser" overhead beam (slide under or dodge)
  | 'barrier_full'    // "404 Firewall" full block (dodge lane)
  | 'banana_stumble'  // "Emotional Damage" Banana (causes stumble, chaser closes in)
  | 'dumpster_fire';  // "Dumpster Fire" burning bin (jump over or dodge)

export interface ObstacleInstance {
  id: string;
  type: ObstacleType;
  lane: Lane;
  z: number;
  width: number;
  height: number;
  depth: number;
  cleared?: boolean;
  hit?: boolean;
}

export type CollectibleType = 'dogecoin' | 'diamond' | 'powerup';

export interface CollectibleInstance {
  id: string;
  type: CollectibleType;
  powerUpType?: PowerUpType;
  lane: Lane;
  y: number;
  z: number;
  collected?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  opacity: number;
}

export interface GameStats {
  score: number;
  distance: number;
  coinsThisRun: number;
  totalCoins: number;
  highScore: number;
  longestDistance: number;
  obstaclesDodged: number;
  powerUpsCollected: number;
  runsPlayed: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number; // Dogecoins
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface DailyRewardDay {
  day: number;
  dogecoins: number;
  label: string;
  emoji: string;
  specialNote?: string;
}

export interface DailyBonusState {
  lastClaimDate: string | null; // "YYYY-MM-DD"
  streak: number; // 1 to 7
  canClaimToday: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  distance: number;
  characterId: string;
  characterEmoji: string;
  characterName: string;
  date: string;
  isCurrentPlayer?: boolean;
}


