"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Trophy } from "lucide-react";

const W = 240;
const H = 300;
const COLS = 8;
const BRICK_ROWS = 5;
const BRICK_W = W / COLS;
const BRICK_H = 18;
const PADDLE_W = 60;
const PADDLE_H = 8;
const PADDLE_Y = H - 24;
const BALL_R = 5;
const BALL_SPEED = 3.8;
const LIVES_INIT = 3;

// Shades of teal for bricks (brightest to darkest)
const ROW_COLORS = [
  "rgb(0,230,218)", // Row 1
  "rgb(0,210,200)", // Row 2
  "rgb(0,190,180)", // Row 3
  "rgb(0,170,160)", // Row 4
  "rgb(0,150,140)", // Row 5
];

type Brick = { x: number; y: number; alive: boolean; color: string };

function makeBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++)
    for (let c = 0; c < COLS; c++)
      bricks.push({ x: c * BRICK_W, y: 32 + r * (BRICK_H + 3), alive: true, color: ROW_COLORS[r] });
  return bricks;
}

export function BreakoutGame() {
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [lives, setLives] = useState(LIVES_INIT);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const ballRef    = useRef({ x: W / 2, y: H / 2 });
  const velRef     = useRef({ x: BALL_SPEED * 0.7, y: -BALL_SPEED });
  const paddleRef  = useRef((W - PADDLE_W) / 2);
  const livesRef   = useRef(LIVES_INIT);
  const scoreRef   = useRef(0);
  const bricksRef  = useRef<Brick[]>([]);
  const isPlayingRef = useRef(false);
  const isPausedRef  = useRef(false);

  const ballElRef   = useRef<HTMLDivElement>(null);
  const paddleElRef = useRef<HTMLDivElement>(null);
  const arenaRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("breakout_highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const syncDOM = useCallback(() => {
    if (ballElRef.current) {
      ballElRef.current.style.left = `${((ballRef.current.x - BALL_R) / W) * 100}%`;
      ballElRef.current.style.top  = `${((ballRef.current.y - BALL_R) / H) * 100}%`;
    }
    if (paddleElRef.current) paddleElRef.current.style.left = `${(paddleRef.current / W) * 100}%`;
  }, []);

  const endGame = useCallback((didWin: boolean) => {
    setIsPlaying(false); isPlayingRef.current = false;
    if (didWin) setWon(true); else setIsGameOver(true);
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem("breakout_highscore", String(scoreRef.current));
    }
  }, [highScore]);

  const resetBall = useCallback(() => {
    ballRef.current = { x: W / 2, y: H / 2 };
    const angle = Math.random() * 0.6 - 0.3;
    velRef.current = { x: BALL_SPEED * Math.sin(angle), y: -BALL_SPEED };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      const ball = ballRef.current;
      const vel  = velRef.current;
      ball.x += vel.x; ball.y += vel.y;

      if (ball.x - BALL_R <= 0)  { ball.x = BALL_R;     vel.x =  Math.abs(vel.x); }
      if (ball.x + BALL_R >= W)  { ball.x = W - BALL_R; vel.x = -Math.abs(vel.x); }
      if (ball.y - BALL_R <= 0)  { ball.y = BALL_R;     vel.y =  Math.abs(vel.y); }

      const px = paddleRef.current;
      if (ball.y + BALL_R >= PADDLE_Y && ball.y + BALL_R <= PADDLE_Y + PADDLE_H + 4 &&
          ball.x >= px - BALL_R && ball.x <= px + PADDLE_W + BALL_R) {
        ball.y = PADDLE_Y - BALL_R;
        const hit = (ball.x - px) / PADDLE_W - 0.5;
        vel.x = hit * BALL_SPEED * 2.5;
        vel.y = -Math.abs(vel.y);
      }

      if (ball.y - BALL_R > H) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        if (livesRef.current <= 0) { endGame(false); return; }
        resetBall(); return;
      }

      let hitBrick = false;
      const updated = bricksRef.current.map((b) => {
        if (!b.alive || hitBrick) return b;
        if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + BRICK_W &&
            ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + BRICK_H) {
          hitBrick = true;
          scoreRef.current += 10;
          setScore(scoreRef.current);
          const fL = Math.abs(ball.x - (b.x + BRICK_W));
          const fR = Math.abs(ball.x - b.x);
          const fT = Math.abs(ball.y - (b.y + BRICK_H));
          const fB = Math.abs(ball.y - b.y);
          const mn = Math.min(fL, fR, fT, fB);
          if (mn === fT || mn === fB) vel.y = -vel.y; else vel.x = -vel.x;
          return { ...b, alive: false };
        }
        return b;
      });
      if (hitBrick) {
        bricksRef.current = updated;
        setBricks([...updated]);
        if (updated.every((b) => !b.alive)) { endGame(true); return; }
      }
      syncDOM();
    }, 16);
    return () => clearInterval(id);
  }, [isPlaying, endGame, resetBall, syncDOM]);

  // ── Mouse / touch drag on arena ──────────────────────────────────────────
  const updatePaddleFromClientX = useCallback((clientX: number) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    paddleRef.current = Math.max(0, Math.min(W - PADDLE_W, relX * W - PADDLE_W / 2));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPlayingRef.current || isPausedRef.current) return;
    updatePaddleFromClientX(e.clientX);
  }, [updatePaddleFromClientX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isPlayingRef.current || isPausedRef.current) return;
    updatePaddleFromClientX(e.touches[0].clientX);
  }, [updatePaddleFromClientX]);

  // Keyboard fallback
  const keysRef = useRef(new Set<string>());
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { if (["ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault(); keysRef.current.add(e.key); };
    const onUp   = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      if (keysRef.current.has("ArrowLeft"))  paddleRef.current = Math.max(0, paddleRef.current - 6);
      if (keysRef.current.has("ArrowRight")) paddleRef.current = Math.min(W - PADDLE_W, paddleRef.current + 6);
      if (paddleElRef.current) paddleElRef.current.style.left = `${(paddleRef.current / W) * 100}%`;
    }, 16);
    return () => clearInterval(id);
  }, [isPlaying]);

  const moveLeft  = () => { paddleRef.current = Math.max(0, paddleRef.current - 18); };
  const moveRight = () => { paddleRef.current = Math.min(W - PADDLE_W, paddleRef.current + 18); };

  const startGame = () => {
    const b = makeBricks();
    bricksRef.current = b; setBricks(b);
    livesRef.current = LIVES_INIT; scoreRef.current = 0;
    setLives(LIVES_INIT); setScore(0); setIsGameOver(false); setWon(false);
    paddleRef.current = (W - PADDLE_W) / 2;
    resetBall();
    setIsPlaying(true); isPlayingRef.current = true;
    setIsPaused(false); isPausedRef.current  = false;
  };

  const togglePause = () => { setIsPaused((p) => { isPausedRef.current = !p; return !p; }); };

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden select-none">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Breakout</p>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-white/20">Score</span>
            <span className="text-xs font-bold text-[rgb(0,167,157)]">{score}</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: LIVES_INIT }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < lives ? "bg-[rgb(0,167,157)]" : "bg-white/10"}`} />
            ))}
          </div>
          {highScore > 0 && (
            <div className="flex items-center gap-1">
              <Trophy size={8} className="text-white/15" />
              <span className="text-[9px] font-bold text-white/20">{highScore}</span>
            </div>
          )}
          {isPlaying && !isGameOver && !won && (
            <button onClick={togglePause} className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
              {isPaused ? <Play size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            </button>
          )}
        </div>
      </div>

      <div
        ref={arenaRef}
        className="relative bg-white/[0.02] border border-white/[0.05] rounded-lg overflow-hidden w-full cursor-none"
        style={{ aspectRatio: `${W}/${H}`, maxWidth: "220px", touchAction: "none" }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {bricks.map((b, i) => b.alive ? (
          <div key={i} className="absolute rounded-[2px]"
            style={{ left:`${(b.x/W)*100}%`, top:`${(b.y/H)*100}%`,
              width:`${(BRICK_W/W)*100}%`, height:`${(BRICK_H/H)*100}%`,
              background: b.color, boxSizing:"border-box", boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.3), 0 0 4px " + b.color.replace('rgb', 'rgba').replace(')', ',0.5)') }} />
        ) : null)}

        <div ref={ballElRef} className="absolute rounded-full bg-white"
          style={{ width:`${(BALL_R*2/W)*100}%`, height:`${(BALL_R*2/H)*100}%`,
            left:`${((W/2-BALL_R)/W)*100}%`, top:`${((H/2-BALL_R)/H)*100}%`,
            boxShadow:"0 0 6px rgba(255,255,255,0.6)" }} />

        <div ref={paddleElRef} className="absolute rounded-full"
          style={{ width:`${(PADDLE_W/W)*100}%`, height:`${(PADDLE_H/H)*100}%`,
            left:`${((W-PADDLE_W)/2/W)*100}%`, top:`${(PADDLE_Y/H)*100}%`,
            background:"rgb(0,167,157)", boxShadow:"0 0 10px rgba(0,167,157,0.4)" }} />

        {(!isPlaying || isPaused) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
            {won ? (
              <>
                <p className="text-sm font-bold text-[rgb(0,167,157)] mb-1">YOU WIN!</p>
                <p className="text-[10px] text-white/40 mb-4">Score: {score}</p>
                <button onClick={startGame} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><RotateCcw size={16}/></button>
              </>
            ) : isGameOver ? (
              <>
                <p className="text-sm font-bold text-red-500 mb-1">GAME OVER</p>
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
                <p className="text-sm font-bold text-white mb-1">BREAKOUT</p>
                <p className="text-[9px] text-white/30 mb-1">drag or ←→ to move · 3 lives</p>
                <p className="text-[9px] text-white/20 mb-4">move mouse over arena</p>
                <button onClick={startGame} className="p-3 rounded-full bg-[rgb(0,167,157)] text-black hover:scale-110 transition-all shadow-lg shadow-[rgb(0,167,157)]/20">
                  <Play size={20} fill="currentColor"/>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button onMouseDown={moveLeft}  onTouchStart={(e)=>{e.preventDefault();moveLeft();}}  className="p-2 px-5 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors text-xs">◀</button>
        <button onMouseDown={moveRight} onTouchStart={(e)=>{e.preventDefault();moveRight();}} className="p-2 px-5 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors text-xs">▶</button>
      </div>
    </div>
  );
}
