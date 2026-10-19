import { LeaderboardEntry } from '../types/game';

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead_1',
    playerName: 'ElonDoge',
    score: 42069,
    distance: 3820,
    characterId: 'doge',
    characterEmoji: '🐕',
    characterName: 'Doge',
    date: '2026-10-12',
  },
  {
    id: 'lead_2',
    playerName: 'Gigachad_69',
    score: 34200,
    distance: 3100,
    characterId: 'gigachad',
    characterEmoji: '🗿',
    characterName: 'Gigachad',
    date: '2026-10-14',
  },
  {
    id: 'lead_3',
    playerName: 'RarePepe420',
    score: 28750,
    distance: 2650,
    characterId: 'pepe',
    characterEmoji: '🐸',
    characterName: 'FeelsGoodMan',
    date: '2026-10-15',
  },
  {
    id: 'lead_4',
    playerName: 'PopcatClicks',
    score: 22400,
    distance: 2180,
    characterId: 'popcat',
    characterEmoji: '🐱',
    characterName: 'Popcat',
    date: '2026-10-16',
  },
  {
    id: 'lead_5',
    playerName: 'DiamondHandsWojak',
    score: 18900,
    distance: 1840,
    characterId: 'wojak',
    characterEmoji: '💎',
    characterName: 'Wojak',
    date: '2026-10-16',
  },
  {
    id: 'lead_6',
    playerName: 'CapyPullUp',
    score: 15300,
    distance: 1590,
    characterId: 'capybara',
    characterEmoji: '🦫',
    characterName: 'Capybara',
    date: '2026-10-17',
  },
  {
    id: 'lead_7',
    playerName: 'SatoshiNakamoto',
    score: 12100,
    distance: 1250,
    characterId: 'doge',
    characterEmoji: '🐕',
    characterName: 'Doge',
    date: '2026-10-17',
  },
  {
    id: 'lead_8',
    playerName: 'StonksOnlyGoUp',
    score: 9450,
    distance: 980,
    characterId: 'wojak',
    characterEmoji: '💎',
    characterName: 'Wojak',
    date: '2026-10-18',
  },
  {
    id: 'lead_9',
    playerName: 'RickAstley1987',
    score: 6800,
    distance: 720,
    characterId: 'pepe',
    characterEmoji: '🐸',
    characterName: 'FeelsGoodMan',
    date: '2026-10-18',
  },
  {
    id: 'lead_10',
    playerName: 'KeyboardCat',
    score: 3500,
    distance: 410,
    characterId: 'popcat',
    characterEmoji: '🐱',
    characterName: 'Popcat',
    date: '2026-10-18',
  },
];

const STORAGE_KEY_LEADERBOARD = 'meme_mania_leaderboard';
const STORAGE_KEY_PLAYER_NAME = 'meme_mania_player_name';

export function getStoredPlayerName(): string {
  return localStorage.getItem(STORAGE_KEY_PLAYER_NAME) || 'Anon Memer';
}

export function setStoredPlayerName(name: string): void {
  const clean = name.trim().slice(0, 16) || 'Anon Memer';
  localStorage.setItem(STORAGE_KEY_PLAYER_NAME, clean);
}

export function loadLeaderboard(): LeaderboardEntry[] {
  const saved = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
  if (saved) {
    try {
      const parsed: LeaderboardEntry[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.score - a.score).slice(0, 10);
      }
    } catch (e) {
      // Fallback
    }
  }

  // First time: initialize with pre-seeded hall of fame
  localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD));
  return INITIAL_LEADERBOARD;
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  const top10 = entries.sort((a, b) => b.score - a.score).slice(0, 10);
  localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(top10));
}

export function qualifiesForTop10(score: number, currentList: LeaderboardEntry[]): boolean {
  if (score <= 0) return false;
  if (currentList.length < 10) return true;
  const lowest = currentList[currentList.length - 1].score;
  return score > lowest;
}

export function getRankForScore(score: number, currentList: LeaderboardEntry[]): number {
  if (score <= 0) return -1;
  const sorted = [...currentList].sort((a, b) => b.score - a.score);
  let rank = 1;
  for (const item of sorted) {
    if (score > item.score) {
      return rank;
    }
    rank++;
  }
  return rank <= 10 ? rank : -1;
}

export function addScoreToLeaderboard(
  newEntry: Omit<LeaderboardEntry, 'id' | 'date'>
): { rank: number; updatedList: LeaderboardEntry[] } {
  const currentList = loadLeaderboard();
  const dateStr = new Date().toISOString().split('T')[0];

  const fullEntry: LeaderboardEntry = {
    ...newEntry,
    id: `score_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: dateStr,
    isCurrentPlayer: true,
  };

  const combined = [...currentList, fullEntry];
  const sorted = combined.sort((a, b) => b.score - a.score).slice(0, 10);

  saveLeaderboard(sorted);

  const rank = sorted.findIndex((item) => item.id === fullEntry.id) + 1;
  return {
    rank,
    updatedList: sorted,
  };
}

export function resetLeaderboardToDefault(): LeaderboardEntry[] {
  localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD));
  return INITIAL_LEADERBOARD;
}
