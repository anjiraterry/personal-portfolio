"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Trophy, RotateCcw, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const GRID_SIZE = 15;
const TICK_MS = 160; // comfortable speed

type Seg = { x: number; y: number };
type Dir = { x: number; y: number };

const INIT_SNAKE: Seg[] = [{ x: 7, y: 7 }];
const INIT_DIR:   Dir   = { x: 0, y: -1 };
const INIT_FOOD:  Seg   = { x: 3, y: 3 };

function isOpposite(a: Dir, b: Dir) { return a.x + b.x === 0 && a.y + b.y === 0; }

function randomFood(snake: Seg[]): Seg {
  let f: Seg;
  do { f = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

export function SnakeGame() {
  // All mutable game state lives in refs — avoids React Strict Mode double-invocation bugs
  const snakeRef     = useRef<Seg[]>(INIT_SNAKE);
  const dirRef       = useRef<Dir>(INIT_DIR);
  const dirQueueRef  = useRef<Dir[]>([]);
  const foodRef      = useRef<Seg>(INIT_FOOD);
  const scoreRef     = useRef(0);
  const highScoreRef = useRef(0);
  const activeRef    = useRef(false); // playing and not paused
  const gameOverRef  = useRef(false);

  // React state only for rendering
  const [snake,     setSnake]     = useState<Seg[]>(INIT_SNAKE);
  const [food,      setFood]      = useState<Seg>(INIT_FOOD);
  const [score,     setScore]     = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [phase,     setPhase]     = useState<"idle" | "playing" | "paused" | "dead">("idle");

  useEffect(() => {
    const saved = localStorage.getItem("snake_highscore");
    if (saved) { const v = parseInt(saved, 10); highScoreRef.current = v; setHighScore(v); }
  }, []);

  const tick = useCallback(() => {
    if (!activeRef.current || gameOverRef.current) return;

    // Consume queued direction
    while (dirQueueRef.current.length > 0) {
      const next = dirQueueRef.current.shift()!;
      if (!isOpposite(next, dirRef.current)) { dirRef.current = next; break; }
    }

    const dir   = dirRef.current;
    const snake = snakeRef.current;
    const head  = snake[0];
    const newHead: Seg = {
      x: (head.x + dir.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + dir.y + GRID_SIZE) % GRID_SIZE,
    };

    // Self-collision
    if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      gameOverRef.current = true;
      activeRef.current   = false;
      setPhase("dead");
      return;
    }

    const ateFood = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const newSnake = ateFood ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)];

    if (ateFood) {
      scoreRef.current++;
      if (scoreRef.current > highScoreRef.current) {
        highScoreRef.current = scoreRef.current;
        setHighScore(scoreRef.current);
        localStorage.setItem("snake_highscore", String(scoreRef.current));
      }
      setScore(scoreRef.current);
      const newFood = randomFood(newSnake);
      foodRef.current = newFood;
      setFood(newFood);
    }

    snakeRef.current = newSnake;
    setSnake([...newSnake]);
  }, []);

  // Stable interval
  useEffect(() => {
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [tick]);

  // Keyboard input → direction queue
  useEffect(() => {
    const dirs: Record<string, Dir> = {
      ArrowUp: { x:0,y:-1 }, ArrowDown: { x:0,y:1 },
      ArrowLeft: { x:-1,y:0 }, ArrowRight: { x:1,y:0 },
    };
    const onKey = (e: KeyboardEvent) => {
      if (!dirs[e.key]) return;
      e.preventDefault();
      if (!activeRef.current) return;
      const next = dirs[e.key];
      const last = dirQueueRef.current[dirQueueRef.current.length - 1] ?? dirRef.current;
      if (!isOpposite(next, last) && !(next.x === last.x && next.y === last.y)) {
        if (dirQueueRef.current.length < 2) dirQueueRef.current.push(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const queueDir = (next: Dir) => {
    if (!activeRef.current) return;
    const last = dirQueueRef.current[dirQueueRef.current.length - 1] ?? dirRef.current;
    if (!isOpposite(next, last) && !(next.x === last.x && next.y === last.y)) {
      if (dirQueueRef.current.length < 2) dirQueueRef.current.push(next);
    }
  };

  const startGame = () => {
    const initFood = INIT_FOOD;
    snakeRef.current    = [...INIT_SNAKE];
    dirRef.current      = INIT_DIR;
    dirQueueRef.current = [];
    foodRef.current     = initFood;
    scoreRef.current    = 0;
    gameOverRef.current = false;
    activeRef.current   = true;
    setSnake([...INIT_SNAKE]);
    setFood(initFood);
    setScore(0);
    setPhase("playing");
  };

  const togglePause = () => {
    setPhase(p => {
      if (p === "playing") { activeRef.current = false; return "paused"; }
      if (p === "paused")  { activeRef.current = true;  return "playing"; }
      return p;
    });
  };

  const isPlaying = phase === "playing";
  const isPaused  = phase === "paused";
  const isDead    = phase === "dead";
  const isIdle    = phase === "idle";

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden group select-none">
      <div className="w-full flex justify-between items-center gap-2 mb-2">
        <Link href="/arcade" tabIndex={-1}
          style={{ textDecoration:"none", cursor:"default" }}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 transition-all hover:[text-shadow:0_0_10px_rgba(0,167,157,0.45)]">
          Snake
        </Link>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-tighter text-white/20">Score:</span>
            <span className="text-xs font-bold text-[rgb(0,167,157)]">{score}</span>
          </div>
          {highScore > 0 && (
            <div className="flex items-center gap-1">
              <Trophy size={9} className="text-white/15"/>
              <span className="text-[10px] font-bold text-white/20">{highScore}</span>
            </div>
          )}
          {isPlaying && (
            <button onClick={togglePause} className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <Pause size={12} fill="currentColor"/>
            </button>
          )}
          {isPaused && (
            <button onClick={togglePause} className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <Play size={12} fill="currentColor"/>
            </button>
          )}
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[180px] bg-white/[0.02] border border-white/[0.05] rounded-lg overflow-hidden">
        {snake.map((seg, i) => (
          <div key={i} className="absolute rounded-[2px]"
            style={{
              width:`${100/GRID_SIZE}%`, height:`${100/GRID_SIZE}%`,
              left:`${(seg.x*100)/GRID_SIZE}%`, top:`${(seg.y*100)/GRID_SIZE}%`,
              background: i === 0 ? "rgb(0,230,220)" : "rgb(0,167,157)",
              opacity: i === 0 ? 1 : Math.max(0.25, 1 - i / (snake.length + 4)),
              boxShadow: i === 0 ? "0 0 5px rgba(0,230,220,0.7)" : "none",
            }}
          />
        ))}
        <div className="absolute rounded-full animate-pulse"
          style={{
            width:`${100/GRID_SIZE}%`, height:`${100/GRID_SIZE}%`,
            left:`${(food.x*100)/GRID_SIZE}%`, top:`${(food.y*100)/GRID_SIZE}%`,
            background:"rgba(255,255,255,0.75)",
            boxShadow:"0 0 4px rgba(255,255,255,0.5)",
          }}
        />

        {isPaused && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
            <p className="text-xs font-bold text-white mb-2">PAUSED</p>
            <button onClick={togglePause} className="p-2 rounded-full bg-[rgb(0,167,157)] text-black"><Play size={14} fill="currentColor"/></button>
          </div>
        )}
        {(isIdle || isDead) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20">
            {isDead ? (
              <>
                <p className="text-sm font-bold text-red-400 mb-1">GAME OVER</p>
                <p className="text-[10px] text-white/40 mb-4">Final Score: {score}</p>
                <button onClick={startGame} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><RotateCcw size={16}/></button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white mb-4">SNAKE</p>
                <button onClick={startGame} className="p-3 rounded-full bg-[rgb(0,167,157)] text-black hover:scale-110 transition-all shadow-lg shadow-[rgb(0,167,157)]/20">
                  <Play size={20} fill="currentColor"/>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-4">
        <div/>
        <button onMouseDown={()=>queueDir({x:0,y:-1})} onTouchStart={(e)=>{e.preventDefault();queueDir({x:0,y:-1});}}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors"><ChevronUp size={16}/></button>
        <div/>
        <button onMouseDown={()=>queueDir({x:-1,y:0})} onTouchStart={(e)=>{e.preventDefault();queueDir({x:-1,y:0});}}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors"><ChevronLeft size={16}/></button>
        <button onMouseDown={()=>queueDir({x:0,y:1})} onTouchStart={(e)=>{e.preventDefault();queueDir({x:0,y:1});}}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors"><ChevronDown size={16}/></button>
        <button onMouseDown={()=>queueDir({x:1,y:0})} onTouchStart={(e)=>{e.preventDefault();queueDir({x:1,y:0});}}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors"><ChevronRight size={16}/></button>
      </div>
    </div>
  );
}
