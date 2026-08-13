"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

const COLS = 8;
const ROWS = 4;
const W = 240;
const H = 300;
const ALIEN_W = 20;
const ALIEN_H = 14;
const ALIEN_PAD_X = (W - COLS * (ALIEN_W + 8)) / 2;
const PLAYER_W = 24;
const PLAYER_H = 12;
const BULLET_W = 3;
const BULLET_H = 10;
const PLAYER_Y = H - 28;
const PLAYER_SPEED = 4;
const ALIEN_DROP = 6;
const FIRE_COOLDOWN = 500;

// Teal palette shades for rows (brightest to darkest)
const ALIEN_COLORS = [
  "rgb(0,230,218)",  // row 0 — brightest
  "rgb(0,190,180)",  // row 1
  "rgb(0,155,145)",  // row 2
  "rgb(0,115,108)",  // row 3 — darkest
];
const ALIEN_GLOW = [
  "rgba(0,230,218,0.5)",
  "rgba(0,190,180,0.4)",
  "rgba(0,155,145,0.35)",
  "rgba(0,115,108,0.3)",
];

// Alien shapes as clip-paths per row
const ALIEN_CLIP = [
  "polygon(20% 0%,80% 0%,100% 30%,85% 55%,65% 55%,55% 100%,45% 100%,35% 55%,15% 55%,0% 30%)",
  "polygon(30% 0%,70% 0%,100% 40%,80% 70%,100% 100%,65% 80%,50% 100%,35% 80%,0% 100%,20% 70%,0% 40%)",
  "polygon(10% 20%,40% 0%,60% 0%,90% 20%,100% 60%,75% 100%,50% 80%,25% 100%,0% 60%)",
  "polygon(50% 0%,90% 25%,100% 60%,80% 100%,20% 100%,0% 60%,10% 25%)",
];

type Alien = { x: number; y: number; alive: boolean; type: number };
type Bullet = { x: number; y: number; fromPlayer: boolean };

function makeAliens(): Alien[] {
  return Array.from({ length: ROWS * COLS }, (_, i) => {
    const r = Math.floor(i / COLS), c = i % COLS;
    return { x: ALIEN_PAD_X + c * (ALIEN_W + 8), y: 28 + r * (ALIEN_H + 10), alive: true, type: r };
  });
}

export function SpaceInvadersGame() {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [playerX, setPlayerX] = useState((W - PLAYER_W) / 2);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [blink, setBlink] = useState(false);

  const aliensRef    = useRef<Alien[]>([]);
  const bulletsRef   = useRef<Bullet[]>([]);
  const playerXRef   = useRef((W - PLAYER_W) / 2);
  const livesRef     = useRef(3);
  const scoreRef     = useRef(0);
  const alienDirRef  = useRef(1);
  const lastFireRef  = useRef(0);
  const isPlayingRef = useRef(false);
  const isPausedRef  = useRef(false);
  const keysRef      = useRef(new Set<string>());
  const frameRef     = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("invaders_highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const endGame = useCallback((didWin: boolean) => {
    setIsPlaying(false); isPlayingRef.current = false;
    if (didWin) setWon(true); else setIsGameOver(true);
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem("invaders_highscore", String(scoreRef.current));
    }
  }, [highScore]);

  const fire = useCallback(() => {
    const now = Date.now();
    if (now - lastFireRef.current < FIRE_COOLDOWN) return;
    lastFireRef.current = now;
    const px = playerXRef.current;
    // Max 2 player bullets on screen
    const existing = bulletsRef.current.filter(b => b.fromPlayer);
    if (existing.length >= 2) return;
    bulletsRef.current = [
      ...bulletsRef.current,
      { x: px + PLAYER_W / 2 - BULLET_W / 2, y: PLAYER_Y - BULLET_H, fromPlayer: true },
    ];
  }, []);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      frameRef.current++;

      // Player movement
      if (keysRef.current.has("ArrowLeft"))  playerXRef.current = Math.max(0, playerXRef.current - PLAYER_SPEED);
      if (keysRef.current.has("ArrowRight")) playerXRef.current = Math.min(W - PLAYER_W, playerXRef.current + PLAYER_SPEED);
      if (keysRef.current.has(" ") || keysRef.current.has("Space")) fire();
      setPlayerX(playerXRef.current);

      // Alien movement
      const liveAliens = aliensRef.current.filter(a => a.alive);
      if (liveAliens.length === 0) { endGame(true); return; }

      const speed = 0.8 + (COLS * ROWS - liveAliens.length) * 0.05;
      const leftmost  = Math.min(...liveAliens.map(a => a.x));
      const rightmost = Math.max(...liveAliens.map(a => a.x + ALIEN_W));

      let drop = false;
      if (rightmost + speed * alienDirRef.current > W - 2) { alienDirRef.current = -1; drop = true; }
      if (leftmost  + speed * alienDirRef.current < 2)     { alienDirRef.current =  1; drop = true; }

      aliensRef.current = aliensRef.current.map(a => ({
        ...a,
        x: a.alive ? a.x + speed * alienDirRef.current : a.x,
        y: a.alive && drop ? a.y + ALIEN_DROP : a.y,
      }));

      // Invasion check
      const lowestY = Math.max(...aliensRef.current.filter(a => a.alive).map(a => a.y + ALIEN_H));
      if (lowestY >= PLAYER_Y - 5) { endGame(false); return; }

      // Alien fire (random bottom-of-column alien)
      if (frameRef.current % 30 === 0) {
        const byCol: Record<number, Alien> = {};
        aliensRef.current.filter(a => a.alive).forEach(a => {
          const c = Math.round((a.x - ALIEN_PAD_X) / (ALIEN_W + 8));
          if (!byCol[c] || a.y > byCol[c].y) byCol[c] = a;
        });
        const shooters = Object.values(byCol);
        if (shooters.length > 0) {
          const s = shooters[Math.floor(Math.random() * shooters.length)];
          bulletsRef.current = [...bulletsRef.current, { x: s.x + ALIEN_W / 2 - BULLET_W / 2, y: s.y + ALIEN_H, fromPlayer: false }];
        }
      }

      // Move bullets
      let nextBullets = bulletsRef.current
        .map(b => ({ ...b, y: b.fromPlayer ? b.y - 7 : b.y + 4 }))
        .filter(b => b.y > -BULLET_H && b.y < H + BULLET_H);

      // Player bullet hits alien
      let updatedAliens = aliensRef.current;
      nextBullets = nextBullets.filter(b => {
        if (!b.fromPlayer) return true;
        const hit = updatedAliens.findIndex(a =>
          a.alive && b.x < a.x + ALIEN_W && b.x + BULLET_W > a.x && b.y < a.y + ALIEN_H && b.y + BULLET_H > a.y
        );
        if (hit >= 0) {
          scoreRef.current += 10 * (ROWS - updatedAliens[hit].type);
          setScore(scoreRef.current);
          updatedAliens = updatedAliens.map((a, i) => i === hit ? { ...a, alive: false } : a);
          return false;
        }
        return true;
      });

      // Alien bullet hits player
      nextBullets = nextBullets.filter(b => {
        if (b.fromPlayer) return true;
        const px = playerXRef.current;
        const hit = b.x < px + PLAYER_W && b.x + BULLET_W > px && b.y < PLAYER_Y + PLAYER_H && b.y + BULLET_H > PLAYER_Y;
        if (hit) {
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) endGame(false);
          return false;
        }
        return true;
      });

      aliensRef.current  = updatedAliens;
      bulletsRef.current = nextBullets;
      setAliens([...updatedAliens]);
      setBullets([...nextBullets]);
      if (frameRef.current % 6 === 0) setBlink(b => !b);
    }, 50);
    return () => clearInterval(id);
  }, [isPlaying, endGame, fire]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (["ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
      keysRef.current.add(e.key);
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  const startGame = () => {
    const a = makeAliens();
    aliensRef.current = a; setAliens(a);
    bulletsRef.current = []; setBullets([]);
    livesRef.current = 3; scoreRef.current = 0;
    setLives(3); setScore(0); setIsGameOver(false); setWon(false);
    playerXRef.current = (W - PLAYER_W) / 2; setPlayerX(playerXRef.current);
    alienDirRef.current = 1; frameRef.current = 0;
    setIsPlaying(true); isPlayingRef.current = true;
    setIsPaused(false); isPausedRef.current  = false;
  };

  const togglePause = () => { setIsPaused(p => { isPausedRef.current = !p; return !p; }); };
  const moveLeft  = useCallback(() => { playerXRef.current = Math.max(0, playerXRef.current - 16); setPlayerX(playerXRef.current); }, []);
  const moveRight = useCallback(() => { playerXRef.current = Math.min(W - PLAYER_W, playerXRef.current + 16); setPlayerX(playerXRef.current); }, []);

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden select-none">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Invaders</p>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-white/20">Score</span>
            <span className="text-xs font-bold text-[rgb(0,167,157)]">{score}</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i < lives ? "bg-[rgb(0,167,157)] shadow-[0_0_4px_rgba(0,167,157,0.6)]" : "bg-white/10"}`} />
            ))}
          </div>
          {highScore > 0 && <div className="flex items-center gap-1"><Trophy size={8} className="text-white/15"/><span className="text-[9px] font-bold text-white/20">{highScore}</span></div>}
          {isPlaying && !isGameOver && !won && (
            <button onClick={togglePause} className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
              {isPaused ? <Play size={12} fill="currentColor"/> : <Pause size={12} fill="currentColor"/>}
            </button>
          )}
        </div>
      </div>

      {/* Arena */}
      <div className="relative bg-[rgba(0,10,12,0.6)] border border-white/[0.05] rounded-lg overflow-hidden w-full"
        style={{ aspectRatio:`${W}/${H}`, maxWidth:"220px" }}>
        {/* Star-field background */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20"
            style={{ width:1, height:1, left:`${(i*83+17)%100}%`, top:`${(i*67+11)%100}%`, opacity:0.3+(i%3)*0.2 }} />
        ))}

        {/* Aliens */}
        {aliens.map((a, i) => a.alive ? (
          <div key={i} className="absolute"
            style={{ left:`${(a.x/W)*100}%`, top:`${(a.y/H)*100}%`, width:`${(ALIEN_W/W)*100}%`, height:`${(ALIEN_H/H)*100}%` }}>
            <div className="w-full h-full"
              style={{
                background: ALIEN_COLORS[a.type],
                clipPath: ALIEN_CLIP[a.type],
                opacity: blink ? 1 : 0.8,
                boxShadow: `0 0 6px ${ALIEN_GLOW[a.type]}`,
                filter: blink ? `brightness(1.1)` : `brightness(0.9)`,
                transition: "filter 0.1s, opacity 0.1s",
              }}
            />
          </div>
        ) : null)}

        {/* Bullets */}
        {bullets.map((b, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              left:`${(b.x/W)*100}%`, top:`${(b.y/H)*100}%`,
              width:`${(BULLET_W/W)*100}%`, height:`${(BULLET_H/H)*100}%`,
              background: b.fromPlayer ? "rgb(0,230,218)" : "rgb(255,100,80)",
              boxShadow: b.fromPlayer ? "0 0 6px rgba(0,230,218,0.8), 0 0 2px rgba(0,230,218,1)" : "0 0 4px rgba(255,100,80,0.8)",
            }} />
        ))}

        {/* Player ship */}
        <div className="absolute" style={{ left:`${(playerX/W)*100}%`, top:`${(PLAYER_Y/H)*100}%`, width:`${(PLAYER_W/W)*100}%`, height:`${(PLAYER_H/H)*100}%` }}>
          <div className="w-full h-full" style={{
            background: "linear-gradient(180deg, rgb(0,230,218), rgb(0,167,157))",
            clipPath: "polygon(50% 0%, 90% 60%, 100% 100%, 68% 78%, 50% 88%, 32% 78%, 0% 100%, 10% 60%)",
            boxShadow: "0 0 10px rgba(0,167,157,0.6), 0 0 4px rgba(0,230,218,0.4)",
          }}/>
        </div>

        {/* Overlay */}
        {(!isPlaying || isPaused) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
            {won ? (
              <>
                <p className="text-sm font-bold text-[rgb(0,220,210)] mb-1">WAVE CLEAR!</p>
                <p className="text-[10px] text-white/40 mb-4">Score: {score}</p>
                <button onClick={startGame} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><RotateCcw size={16}/></button>
              </>
            ) : isGameOver ? (
              <>
                <p className="text-sm font-bold text-red-400 mb-1">GAME OVER</p>
                <p className="text-[10px] text-white/40 mb-4">Score: {score}</p>
                <button onClick={startGame} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><RotateCcw size={16}/></button>
              </>
            ) : isPaused ? (
              <>
                <p className="text-xs font-bold text-white mb-2">PAUSED</p>
                <button onClick={togglePause} className="p-2 rounded-full bg-[rgb(0,167,157)] text-black"><Play size={14} fill="currentColor"/></button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white mb-1">INVADERS</p>
                <p className="text-[9px] text-white/30 mb-4">←→ move · space or FIRE to shoot</p>
                <button onClick={startGame} className="p-3 rounded-full bg-[rgb(0,167,157)] text-black hover:scale-110 transition-all shadow-lg shadow-[rgb(0,167,157)]/20">
                  <Play size={20} fill="currentColor"/>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls — left, FIRE, right */}
      <div className="flex gap-2 mt-3">
        <button
          onMouseDown={moveLeft} onTouchStart={(e)=>{e.preventDefault();moveLeft();}}
          className="p-2 px-4 rounded-lg bg-white/[0.05] border border-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.15)] active:border-[rgba(0,167,157,0.3)] active:text-[rgb(0,220,210)] transition-all"
        >
          <ChevronLeft size={16}/>
        </button>
        <button
          onMouseDown={fire} onTouchStart={(e)=>{e.preventDefault();fire();}}
          className="p-2 px-5 rounded-lg bg-[rgba(0,167,157,0.12)] border border-[rgba(0,167,157,0.25)] text-[rgb(0,220,210)] font-bold text-[10px] tracking-widest uppercase active:bg-[rgba(0,167,157,0.3)] active:shadow-[0_0_12px_rgba(0,167,157,0.4)] transition-all"
        >
          Fire
        </button>
        <button
          onMouseDown={moveRight} onTouchStart={(e)=>{e.preventDefault();moveRight();}}
          className="p-2 px-4 rounded-lg bg-white/[0.05] border border-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.15)] active:border-[rgba(0,167,157,0.3)] active:text-[rgb(0,220,210)] transition-all"
        >
          <ChevronRight size={16}/>
        </button>
      </div>
    </div>
  );
}
