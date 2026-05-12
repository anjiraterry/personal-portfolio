"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Trophy, RotateCcw, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 3, y: 3 };

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const moveSnake = useCallback(() => {
    if (isGameOver || !isPlaying || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 1;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPlaying, isPaused, highScore]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, isPaused, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleControl = (e: React.MouseEvent | React.TouchEvent, dir: string) => {
    e.preventDefault();
    if (!isPlaying || isPaused) return;
    switch (dir) {
      case "up": if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
      case "down": if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
      case "left": if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
      case "right": if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden group select-none">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Arcade</p>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-tighter text-white/20">Score:</span>
            <span className="text-xs font-bold text-[rgb(0,167,157)]">{score}</span>
          </div>
          {isPlaying && !isGameOver && (
             <button 
               onClick={() => setIsPaused(!isPaused)}
               className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all"
             >
               {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
             </button>
          )}
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[180px] bg-white/[0.02] border border-white/[0.05] rounded-lg overflow-hidden grid grid-cols-15 grid-rows-15">
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-[rgb(0,167,157)] rounded-[2px]"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x * 100) / GRID_SIZE}%`,
              top: `${(segment.y * 100) / GRID_SIZE}%`,
              opacity: 1 - i / (snake.length + 5),
            }}
          />
        ))}

        <div
          className="absolute bg-white/60 rounded-full animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />

        {isPaused && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
             <p className="text-xs font-bold text-white mb-2">PAUSED</p>
             <button onClick={() => setIsPaused(false)} className="p-2 rounded-full bg-[rgb(0,167,157)] text-black">
               <Play size={14} fill="currentColor" />
             </button>
           </div>
        )}

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20">
            {isGameOver ? (
              <>
                <p className="text-sm font-bold text-red-500 mb-1">GAME OVER</p>
                <p className="text-[10px] text-white/40 mb-4">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
                >
                  <RotateCcw size={16} />
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white mb-4">PLAY SNAKE</p>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="p-3 rounded-full bg-[rgb(0,167,157)] text-black hover:scale-110 transition-all shadow-lg shadow-[rgb(0,167,157)]/20"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1 mt-4">
        <div />
        <button 
          onMouseDown={(e) => handleControl(e, "up")} 
          onTouchStart={(e) => handleControl(e, "up")}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-white/20 active:text-white transition-colors"
        >
          <ChevronUp size={16} />
        </button>
        <div />
        <button 
          onMouseDown={(e) => handleControl(e, "left")} 
          onTouchStart={(e) => handleControl(e, "left")}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-white/20 active:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onMouseDown={(e) => handleControl(e, "down")} 
          onTouchStart={(e) => handleControl(e, "down")}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-white/20 active:text-white transition-colors"
        >
          <ChevronDown size={16} />
        </button>
        <button 
          onMouseDown={(e) => handleControl(e, "right")} 
          onTouchStart={(e) => handleControl(e, "right")}
          className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-white/20 active:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
