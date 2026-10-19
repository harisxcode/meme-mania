import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ThreeRunnerScene } from './three/ThreeRunnerScene';
import { HUDOverlay } from './components/HUDOverlay';
import { MobileControls } from './components/MobileControls';
import { StartMenu } from './components/StartMenu';
import { GameOverModal } from './components/GameOverModal';
import { ShopModal } from './components/ShopModal';
import { QuestsModal } from './components/QuestsModal';
import { GitHubRepoModal } from './components/GitHubRepoModal';
import { PauseModal } from './components/PauseModal';
import { DailyBonusModal } from './components/DailyBonusModal';
import { soundManager } from './audio/soundManager';
import { 
  ActivePowerUp, 
  CharacterConfig, 
  FloatingText, 
  GameState, 
  PowerUpConfig, 
  PowerUpType, 
  Quest,
  DailyBonusState
} from './types/game';
import { 
  INITIAL_CHARACTERS, 
  INITIAL_POWERUPS, 
  INITIAL_QUESTS 
} from './data/characters';
import { getDailyBonusStatus, claimDailyReward } from './data/dailyBonus';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeRunnerScene | null>(null);

  // Gameplay state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [coinsThisRun, setCoinsThisRun] = useState<number>(0);
  const [chaserThreat, setChaserThreat] = useState<number>(0);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Persistence: Total coins, High score, Characters, Powerups, Quests
  const [totalCoins, setTotalCoins] = useState<number>(() => {
    const saved = localStorage.getItem('meme_mania_coins');
    return saved ? parseInt(saved, 10) : 50; // Starter gift
  });

  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('meme_mania_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [characters, setCharacters] = useState<CharacterConfig[]>(() => {
    const saved = localStorage.getItem('meme_mania_characters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return INITIAL_CHARACTERS;
  });

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(() => {
    return localStorage.getItem('meme_mania_selected_char') || 'doge';
  });

  const [powerUps, setPowerUps] = useState<Record<string, PowerUpConfig>>(() => {
    const saved = localStorage.getItem('meme_mania_powerups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_POWERUPS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('meme_mania_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_QUESTS;
  });

  // Modal Dialogs
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isGithubDocsOpen, setIsGithubDocsOpen] = useState(false);
  const [isDailyBonusOpen, setIsDailyBonusOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Daily Login Bonus State
  const [dailyBonusStatus, setDailyBonusStatus] = useState<DailyBonusState>(() => getDailyBonusStatus());

  // Auto-open daily bonus on first game open if ready
  useEffect(() => {
    if (dailyBonusStatus.canClaimToday) {
      const timer = setTimeout(() => {
        setIsDailyBonusOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync state refs for callbacks
  const totalCoinsRef = useRef(totalCoins);
  totalCoinsRef.current = totalCoins;

  const highScoreRef = useRef(highScore);
  highScoreRef.current = highScore;

  const questsRef = useRef(quests);
  questsRef.current = quests;

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('meme_mania_coins', totalCoins.toString());
  }, [totalCoins]);

  useEffect(() => {
    localStorage.setItem('meme_mania_highscore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('meme_mania_characters', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem('meme_mania_selected_char', selectedCharacterId);
  }, [selectedCharacterId]);

  useEffect(() => {
    localStorage.setItem('meme_mania_powerups', JSON.stringify(powerUps));
  }, [powerUps]);

  useEffect(() => {
    localStorage.setItem('meme_mania_quests', JSON.stringify(quests));
  }, [quests]);

  // Floating text trigger
  const addFloatingText = useCallback((text: string, color: string) => {
    const newText: FloatingText = {
      id: `${Date.now()}_${Math.random()}`,
      text,
      color,
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 40,
      opacity: 1,
    };

    setFloatingTexts((prev) => [...prev.slice(-4), newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newText.id));
    }, 1200);
  }, []);

  // Update Quest Progress helper
  const updateQuestProgress = useCallback((questId: string, amount: number, isDirectSet = false) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const newProgress = isDirectSet ? Math.max(q.progress, amount) : q.progress + amount;
          const completed = newProgress >= q.target;
          return {
            ...q,
            progress: newProgress,
            completed,
          };
        }
        return q;
      })
    );
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new ThreeRunnerScene(mountRef.current, {
      onScoreUpdate: (newScore, newDistance, newCoins) => {
        setScore(newScore);
        setDistance(newDistance);
        setCoinsThisRun(newCoins);

        // Check quest progress
        updateQuestProgress('quest_distance_1000', newDistance, true);
        updateQuestProgress('quest_score_10000', newScore, true);
      },
      onPowerUpCollected: (type, duration) => {
        setActivePowerUps((prev) => {
          const filtered = prev.filter((p) => p.type !== type);
          return [...filtered, { type, duration, timeRemaining: duration }];
        });
        updateQuestProgress('quest_powerups_5', 1);
      },
      onPowerUpExpired: (type) => {
        setActivePowerUps((prev) => prev.filter((p) => p.type !== type));
      },
      onStumble: (threat) => {
        setChaserThreat(threat);
      },
      onGameOver: (reason, finalScore) => {
        setGameOverReason(reason);
        setGameState('gameover');

        // Dogecoins bank
        setTotalCoins((prev) => prev + coinsThisRun);

        // High score check
        if (finalScore > highScoreRef.current) {
          setHighScore(finalScore);
          setIsNewHighScore(true);
        } else {
          setIsNewHighScore(false);
        }

        // Quests
        updateQuestProgress('quest_first_run', 1);
        updateQuestProgress('quest_coins_100', coinsThisRun);
      },
      onFloatingText: (text, color) => {
        addFloatingText(text, color);
      },
    });

    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [addFloatingText, updateQuestProgress, coinsThisRun]);

  // Handle Character change in 3D scene
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCharacter(selectedCharacterId);
    }
  }, [selectedCharacterId]);

  // Power-Up countdown timer in React state
  useEffect(() => {
    if (gameState !== 'playing' || activePowerUps.length === 0) return;

    const interval = window.setInterval(() => {
      setActivePowerUps((prev) =>
        prev
          .map((p) => ({
            ...p,
            timeRemaining: Math.max(0, p.timeRemaining - 0.1),
          }))
          .filter((p) => p.type === 'rickroll' || p.timeRemaining > 0)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, activePowerUps.length]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sceneRef.current) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        sceneRef.current.moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        sceneRef.current.moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        sceneRef.current.jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        sceneRef.current.slide();
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
          handlePause();
        } else if (gameState === 'paused') {
          handleResume();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch Swipe Gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!sceneRef.current || gameState !== 'playing') return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);

      if (Math.max(absX, absY) > 28) {
        if (absX > absY) {
          // Horizontal Swipe
          if (diffX > 0) {
            sceneRef.current.moveRight();
          } else {
            sceneRef.current.moveLeft();
          }
        } else {
          // Vertical Swipe
          if (diffY < 0) {
            sceneRef.current.jump();
          } else {
            sceneRef.current.slide();
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState]);

  // Actions
  const handleStartGame = () => {
    setScore(0);
    setDistance(0);
    setCoinsThisRun(0);
    setActivePowerUps([]);
    setChaserThreat(0);
    setGameState('playing');
    setIsShopOpen(false);
    setIsQuestsOpen(false);
    setIsGithubDocsOpen(false);

    if (sceneRef.current) {
      sceneRef.current.startGame();
    }
  };

  const handlePause = () => {
    setGameState('paused');
    if (sceneRef.current) {
      sceneRef.current.pauseGame();
    }
  };

  const handleResume = () => {
    setGameState('playing');
    if (sceneRef.current) {
      sceneRef.current.resumeGame();
    }
  };

  const handleRestart = () => {
    handleStartGame();
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
    soundManager.stopMusic();
    if (sceneRef.current) {
      sceneRef.current.pauseGame();
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  // Economy Actions
  const handleUnlockCharacter = (charId: string, cost: number) => {
    if (totalCoins < cost) return;
    setTotalCoins((prev) => prev - cost);
    setCharacters((prev) =>
      prev.map((c) => (c.id === charId ? { ...c, unlocked: true } : c))
    );
    setSelectedCharacterId(charId);
  };

  const handleUpgradePowerUp = (powerUpId: string, cost: number) => {
    if (totalCoins < cost) return;
    setTotalCoins((prev) => prev - cost);
    setPowerUps((prev) => {
      const current = prev[powerUpId];
      if (!current) return prev;
      return {
        ...prev,
        [powerUpId]: {
          ...current,
          level: current.level + 1,
          duration: current.duration + 2,
          costToUpgrade: Math.floor(current.costToUpgrade * 1.5),
        },
      };
    });
  };

  const handleClaimQuest = (questId: string, reward: number) => {
    setTotalCoins((prev) => prev + reward);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );
  };

  const handleClaimDailyBonus = () => {
    const { rewardCoins, newStreak } = claimDailyReward();
    setTotalCoins((prev) => prev + rewardCoins);
    setDailyBonusStatus({
      lastClaimDate: new Date().toISOString().split('T')[0],
      streak: newStreak,
      canClaimToday: false,
    });
    addFloatingText(`+${rewardCoins} Ð DAILY BONUS! 🎁`, '#facc15');
    updateQuestProgress('quest_coins_100', rewardCoins);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" 
      />

      {/* In-Game HUD (During Gameplay) */}
      {gameState === 'playing' && (
        <>
          <HUDOverlay
            score={score}
            distance={distance}
            coins={coinsThisRun}
            activePowerUps={activePowerUps}
            chaserThreat={chaserThreat}
            floatingTexts={floatingTexts}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={handlePause}
          />
          <MobileControls
            onLeft={() => sceneRef.current?.moveLeft()}
            onRight={() => sceneRef.current?.moveRight()}
            onJump={() => sceneRef.current?.jump()}
            onSlide={() => sceneRef.current?.slide()}
          />
        </>
      )}

      {/* Start Menu Overlay */}
      {gameState === 'menu' && (
        <StartMenu
          characters={characters}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={(charId) => setSelectedCharacterId(charId)}
          onStartGame={handleStartGame}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenQuests={() => setIsQuestsOpen(true)}
          onOpenGithubDocs={() => setIsGithubDocsOpen(true)}
          onOpenDailyBonus={() => setIsDailyBonusOpen(true)}
          canClaimDailyBonus={dailyBonusStatus.canClaimToday}
          highScore={highScore}
          totalCoins={totalCoins}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          reason={gameOverReason}
          score={score}
          distance={distance}
          coins={coinsThisRun}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenGithubDocs={() => setIsGithubDocsOpen(true)}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onHome={handleReturnToMenu}
          onOpenGithubDocs={() => setIsGithubDocsOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Meme Locker & Shop Modal */}
      {isShopOpen && (
        <ShopModal
          characters={characters}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={(charId) => setSelectedCharacterId(charId)}
          onUnlockCharacter={handleUnlockCharacter}
          powerUps={powerUps}
          onUpgradePowerUp={handleUpgradePowerUp}
          totalCoins={totalCoins}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Quests & Achievements Modal */}
      {isQuestsOpen && (
        <QuestsModal
          quests={quests}
          onClaimQuest={handleClaimQuest}
          onClose={() => setIsQuestsOpen(false)}
        />
      )}

      {/* Daily Login Bonus Modal */}
      {isDailyBonusOpen && (
        <DailyBonusModal
          status={dailyBonusStatus}
          onClaim={handleClaimDailyBonus}
          onClose={() => setIsDailyBonusOpen(false)}
        />
      )}

      {/* GitHub Repository & Documentation Modal */}
      {isGithubDocsOpen && (
        <GitHubRepoModal
          onClose={() => setIsGithubDocsOpen(false)}
        />
      )}
    </div>
  );
}
