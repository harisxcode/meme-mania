import { DailyRewardDay, DailyBonusState } from '../types/game';

export const DAILY_REWARDS: DailyRewardDay[] = [
  { day: 1, dogecoins: 50, label: 'Much Welcome!', emoji: '🐕' },
  { day: 2, dogecoins: 75, label: 'Good Boy Streak', emoji: '🦴' },
  { day: 3, dogecoins: 100, label: 'Stonks Building', emoji: '📈' },
  { day: 4, dogecoins: 150, label: 'Chad Discipline', emoji: '🗿' },
  { day: 5, dogecoins: 200, label: 'Diamond Hands', emoji: '💎' },
  { day: 6, dogecoins: 250, label: 'Popcat Supreme', emoji: '🐱' },
  { day: 7, dogecoins: 500, label: 'LEGENDARY MEME LORD', emoji: '👑', specialNote: 'MAX REWARD! 🎉' },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const STORAGE_KEY_LAST_CLAIM = 'meme_mania_last_claim_date';
const STORAGE_KEY_STREAK = 'meme_mania_login_streak';

export function getDailyBonusStatus(): DailyBonusState {
  const lastClaim = localStorage.getItem(STORAGE_KEY_LAST_CLAIM);
  const savedStreak = localStorage.getItem(STORAGE_KEY_STREAK);
  const streak = savedStreak ? parseInt(savedStreak, 10) : 0;
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (!lastClaim) {
    // First time player
    return {
      lastClaimDate: null,
      streak: 1,
      canClaimToday: true,
    };
  }

  if (lastClaim === today) {
    // Already claimed today
    return {
      lastClaimDate: lastClaim,
      streak: streak === 0 ? 1 : streak,
      canClaimToday: false,
    };
  }

  if (lastClaim === yesterday) {
    // Consecutive day login!
    // If they already claimed day 7 yesterday, wrap back to day 1, otherwise streak + 1
    const nextDay = streak >= 7 ? 1 : streak + 1;
    return {
      lastClaimDate: lastClaim,
      streak: nextDay,
      canClaimToday: true,
    };
  }

  // Missed a day or more: streak resets to day 1
  return {
    lastClaimDate: lastClaim,
    streak: 1,
    canClaimToday: true,
  };
}

export function claimDailyReward(): { rewardCoins: number; newStreak: number } {
  const status = getDailyBonusStatus();
  const today = getTodayDateString();
  const currentStreak = status.streak;

  const rewardConfig = DAILY_REWARDS.find((r) => r.day === currentStreak) || DAILY_REWARDS[0];
  const rewardCoins = rewardConfig.dogecoins;

  localStorage.setItem(STORAGE_KEY_LAST_CLAIM, today);
  localStorage.setItem(STORAGE_KEY_STREAK, currentStreak.toString());

  return {
    rewardCoins,
    newStreak: currentStreak,
  };
}
