"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";

const W = 240;
const H = 300;
const BALL_SIZE = 8;
const PADDLE_W = 10;
const PADDLE_H = 56;
const BALL_SPEED = 3.5;
const AI_SPEED = 2.4;
const WIN_SCORE = 7;

type Vec2 = { x: number; y: number };

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function PongGame() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);

  const ballRef = useRef<Vec2>({ x: W / 2, y: H / 2 });
  const velRef = useRef<Vec2>({ x: BALL_SPEED, y: BALL_SPEED });
  const playerYRef = useRef((H - PADDLE_H) / 2);
  const aiYRef = useRef((H - PADDLE_H) / 2);
  const playerScoreRef = useRef(0);
  const aiScoreRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);

  const ballElRef = useRef<HTMLDivElement>(null);
  const playerElRef = useRef<HTMLDivElement>(null);
  const aiElRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pong_highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const syncDOM = useCallback(() => {
    if (ballElRef.current) {
      ballElRef.current.style.left = `${(ballRef.current.x / W) * 100}%`;
      ballElRef.current.style.top  = `${(ballRef.current.y / H) * 100}%`;
    }
    if (playerElRef.current) playerElRef.current.style.top = `${(playerYRef.current / H) * 100}%`;
    if (aiElRef.current)     aiElRef.current.style.top     = `${(aiYRef.current / H) * 100}%`;
  }, []);

  const resetBall = useCallback((direction: 1 | -1 = 1) => {
    ballRef.current = { x: W / 2, y: H / 2 };
    const angle = Math.random() * 0.8 - 0.4;
    velRef.current = {
      x: direction * BALL_SPEED * Math.cos(angle),
      y: BALL_SPEED * Math.sin(angle),
    };
  }, []);

  const scorePoint = useCallback((scorer: "player" | "ai") => {
    if (scorer === "player") {
      playerScoreRef.current += 1;
      setPlayerScore(playerScoreRef.current);
      if (playerScoreRef.current >= WIN_SCORE) {
        setWinner("player");
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (playerScoreRef.current > highScore) {
          setHighScore(playerScoreRef.current);
          localStorage.setItem("pong_highscore", String(playerScoreRef.current));
        }
        return;
      }
      resetBall(-1);
    } else {
      aiScoreRef.current += 1;
      setAiScore(aiScoreRef.current);
      if (aiScoreRef.current >= WIN_SCORE) {
        setWinner("ai");
        setIsPlaying(false);
        isPlayingRef.current = false;
        return;
      }
      resetBall(1);
    }
  }, [highScore, resetBall]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      const ball = ballRef.current;
      const vel = velRef.current;
      ball.x += vel.x;
      ball.y += vel.y;

      if (ball.y <= 0)            { ball.y = 0;            vel.y =  Math.abs(vel.y); }
      if (ball.y + BALL_SIZE >= H){ ball.y = H - BALL_SIZE; vel.y = -Math.abs(vel.y); }

      const pTop = playerYRef.current;
      if (ball.x <= PADDLE_W + 2 && ball.y + BALL_SIZE >= pTop && ball.y <= pTop + PADDLE_H) {
        ball.x = PADDLE_W + 2;
        const hit = (ball.y + BALL_SIZE / 2 - pTop) / PADDLE_H - 0.5;
        vel.x = Math.abs(vel.x) * 1.05;
        vel.y = hit * BALL_SPEED * 2;
      }

      const aTop = aiYRef.current;
      if (ball.x + BALL_SIZE >= W - PADDLE_W - 2 && ball.y + BALL_SIZE >= aTop && ball.y <= aTop + PADDLE_H) {
        ball.x = W - PADDLE_W - 2 - BALL_SIZE;
        const hit = (ball.y + BALL_SIZE / 2 - aTop) / PADDLE_H - 0.5;
        vel.x = -Math.abs(vel.x) * 1.05;
        vel.y = hit * BALL_SPEED * 2;
      }

      const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2);
      if (speed > BALL_SPEED * 2.5) { vel.x = (vel.x / speed) * BALL_SPEED * 2.5; vel.y = (vel.y / speed) * BALL_SPEED * 2.5; }

      const aiCenter = aiYRef.current + PADDLE_H / 2;
      const ballCenter = ball.y + BALL_SIZE / 2;
      if (aiCenter < ballCenter - 4) aiYRef.current = clamp(aiYRef.current + AI_SPEED, 0, H - PADDLE_H);
      if (aiCenter > ballCenter + 4) aiYRef.current = clamp(aiYRef.current - AI_SPEED, 0, H - PADDLE_H);

      if (ball.x < -20)  { scorePoint("ai");     return; }
      if (ball.x > W + 20){ scorePoint("player"); return; }

      syncDOM();
    }, 16);
    return () => clearInterval(id);
  }, [isPlaying, scorePoint, syncDOM]);

  // ── Mouse / touch drag on the arena ──────────────────────────────────────
  const updatePaddleFromClientY = useCallback((clientY: number) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relY = (clientY - rect.top) / rect.height;
    playerYRef.current = clamp(relY * H - PADDLE_H / 2, 0, H - PADDLE_H);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPlayingRef.current || isPausedRef.current) return;
    updatePaddleFromClientY(e.clientY);
  }, [updatePaddleFromClientY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!isPlayingRef.current || isPausedRef.current) return;
    updatePaddleFromClientY(e.touches[0].clientY);
  }, [updatePaddleFromClientY]);

  // Keyboard (fallback)
  const keysRef = useRef(new Set<string>());
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { if (["ArrowUp","ArrowDown"].includes(e.key)) e.preventDefault(); keysRef.current.add(e.key); };
    const onUp   = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (!isPlayingRef.current || isPausedRef.current) return;
      if (keysRef.current.has("ArrowUp"))   playerYRef.current = clamp(playerYRef.current - 5, 0, H - PADDLE_H);
      if (keysRef.current.has("ArrowDown")) playerYRef.current = clamp(playerYRef.current + 5, 0, H - PADDLE_H);
      if (playerElRef.current) playerElRef.current.style.top = `${(playerYRef.current / H) * 100}%`;
    }, 16);
    return () => clearInterval(id);
  }, [isPlaying]);

  const moveUp   = () => { playerYRef.current = clamp(playerYRef.current - 12, 0, H - PADDLE_H); };
  const moveDown = () => { playerYRef.current = clamp(playerYRef.current + 12, 0, H - PADDLE_H); };

  const startGame = () => {
    playerScoreRef.current = 0; aiScoreRef.current = 0;
    setPlayerScore(0); setAiScore(0); setWinner(null);
    playerYRef.current = (H - PADDLE_H) / 2;
    aiYRef.current     = (H - PADDLE_H) / 2;
    resetBall(1);
    setIsPlaying(true); isPlayingRef.current = true;
    setIsPaused(false); isPausedRef.current  = false;
  };

  const togglePause = () => { setIsPaused((p) => { isPausedRef.current = !p; return !p; }); };

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden select-none">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Pong</p>
        <div className="flex gap-3 items-center">
          <span className="text-xs font-bold text-[rgb(0,167,157)]">{playerScore}</span>
          <span className="text-[10px] text-white/20">vs</span>
          <span className="text-xs font-bold text-white/40">{aiScore}</span>
          {highScore > 0 && (
            <div className="flex items-center gap-1">
              <Trophy size={8} className="text-white/15" />
              <span className="text-[9px] font-bold text-white/20">{highScore}</span>
            </div>
          )}
          {isPlaying && !winner && (
            <button onClick={togglePause} className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
              {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
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
        <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-white/[0.06]" />

        <div ref={ballElRef} className="absolute bg-white rounded-sm"
          style={{ width:`${(BALL_SIZE/W)*100}%`, height:`${(BALL_SIZE/H)*100}%`,
            left:`${(W/2/W)*100}%`, top:`${(H/2/H)*100}%`,
            boxShadow:"0 0 6px rgba(255,255,255,0.5)" }} />

        <div ref={playerElRef} className="absolute left-0 rounded-r-sm"
          style={{ width:`${(PADDLE_W/W)*100}%`, height:`${(PADDLE_H/H)*100}%`,
            top:`${((H-PADDLE_H)/2/H)*100}%`,
            background:"rgb(0,167,157)", boxShadow:"0 0 8px rgba(0,167,157,0.4)" }} />

        <div ref={aiElRef} className="absolute right-0 rounded-l-sm"
          style={{ width:`${(PADDLE_W/W)*100}%`, height:`${(PADDLE_H/H)*100}%`,
            top:`${((H-PADDLE_H)/2/H)*100}%`, background:"rgba(255,255,255,0.3)" }} />

        {(!isPlaying || isPaused) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
            {winner ? (
              <>
                <p className={`text-sm font-bold mb-1 ${winner==="player"?"text-[rgb(0,167,157)]":"text-red-400"}`}>
                  {winner==="player"?"YOU WIN!":"AI WINS"}
                </p>
                <p className="text-[10px] text-white/40 mb-4">{playerScore} – {aiScore}</p>
                <button onClick={startGame} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><RotateCcw size={16}/></button>
              </>
            ) : isPaused ? (
              <>
                <p className="text-xs font-bold text-white mb-2">PAUSED</p>
                <button onClick={togglePause} className="p-2 rounded-full bg-[rgb(0,167,157)] text-black"><Play size={14} fill="currentColor"/></button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white mb-1">PONG</p>
                <p className="text-[9px] text-white/30 mb-1">First to {WIN_SCORE} · you are left</p>
                <p className="text-[9px] text-white/20 mb-4">drag or ↑↓ to move</p>
                <button onClick={startGame} className="p-3 rounded-full bg-[rgb(0,167,157)] text-black hover:scale-110 transition-all shadow-lg shadow-[rgb(0,167,157)]/20">
                  <Play size={20} fill="currentColor"/>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button onMouseDown={moveUp}   onTouchStart={(e)=>{e.preventDefault();moveUp();}}   className="p-2 px-5 rounded-lg bg-white/[0.05] text-white/40 active:bg-white/20 active:text-white transition-colors text-xs">▲</button>
        <button onMouseDown={moveDown} onTouchStart={(e)=>{e.preventDefault();moveDown();}} className="p-2 px-5 rounded-lg bg-white/[0.05] text-white/40 active:bg-white/20 active:text-white transition-colors text-xs">▼</button>
      </div>
    </div>
  );
}
