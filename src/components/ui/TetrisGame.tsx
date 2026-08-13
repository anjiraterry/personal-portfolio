"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";

const COLS = 10;
const ROWS = 18;
const TICK_MS = 500;

type Cell = null | string;
type Grid = Cell[][];
type Piece = { shape: number[][]; color: string; x: number; y: number };

// Shades of teal for Tetris pieces
const PIECES = [
  { shape: [[1, 1, 1, 1]], color: "rgb(0,230,218)" },                              // I (bright teal)
  { shape: [[1, 1], [1, 1]], color: "rgb(0,210,200)" },                            // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "rgb(0,190,180)" },                      // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: "rgb(0,170,160)" },                      // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: "rgb(0,150,140)" },                      // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: "rgb(0,130,120)" },                      // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: "rgb(0,110,100)" },                      // L (dark teal)
];

function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece(): Piece {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: p.shape, color: p.color, x: Math.floor(COLS / 2) - 1, y: 0 };
}

function rotate(shape: number[][]): number[][] {
  return shape[0].map((_, i) => shape.map((row) => row[i]).reverse());
}

function isValid(grid: Grid, piece: Piece, dx = 0, dy = 0, shape = piece.shape): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && grid[ny][nx]) return false;
    }
  }
  return true;
}

function placePiece(grid: Grid, piece: Piece): Grid {
  const next = grid.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const ny = piece.y + r;
        const nx = piece.x + c;
        if (ny >= 0) next[ny][nx] = piece.color;
      }
    }
  }
  return next;
}

function clearLines(grid: Grid): { grid: Grid; cleared: number } {
  const next = grid.filter((row) => row.some((cell) => cell === null));
  const cleared = ROWS - next.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { grid: [...empty, ...next], cleared };
}

const SCORE_TABLE = [0, 100, 300, 500, 800];

export function TetrisGame() {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [piece, setPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  const stateRef = useRef({ grid, piece, isPlaying, isPaused, isGameOver, score, level });
  useEffect(() => { stateRef.current = { grid, piece, isPlaying, isPaused, isGameOver, score, level }; });

  useEffect(() => {
    const saved = localStorage.getItem("tetris_highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnPiece = useCallback((currentGrid: Grid) => {
    const next = randomPiece();
    if (!isValid(currentGrid, next)) {
      setIsGameOver(true);
      setIsPlaying(false);
    } else {
      setPiece(next);
    }
  }, []);

  const lockAndSpawn = useCallback((currentGrid: Grid, currentPiece: Piece) => {
    const placed = placePiece(currentGrid, currentPiece);
    const { grid: clearedGrid, cleared } = clearLines(placed);
    setGrid(clearedGrid);
    setScore((s) => {
      const pts = s + SCORE_TABLE[cleared] * stateRef.current.level;
      const newHigh = Math.max(pts, stateRef.current.level > 0 ? highScore : 0);
      if (pts > highScore) {
        setHighScore(pts);
        localStorage.setItem("tetris_highscore", String(pts));
      }
      return pts;
    });
    if (cleared > 0) setLevel((l) => Math.min(10, Math.floor(l + cleared * 0.2)));
    spawnPiece(clearedGrid);
  }, [spawnPiece, highScore]);

  // Game tick
  useEffect(() => {
    if (!isPlaying || isPaused || !piece) return;
    const speed = Math.max(80, TICK_MS - (level - 1) * 50);
    const id = setInterval(() => {
      const { grid: g, piece: p, isPaused: ip, isGameOver: igo } = stateRef.current;
      if (!p || ip || igo) return;
      if (isValid(g, p, 0, 1)) {
        setPiece((prev) => prev ? { ...prev, y: prev.y + 1 } : prev);
      } else {
        lockAndSpawn(g, p);
      }
    }, speed);
    return () => clearInterval(id);
  }, [isPlaying, isPaused, piece, level, lockAndSpawn]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { piece: p, grid: g, isPlaying: ip, isPaused: ipp } = stateRef.current;
      if (!ip || ipp || !p) return;
      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); if (isValid(g, p, -1, 0)) setPiece({ ...p, x: p.x - 1 }); break;
        case "ArrowRight": e.preventDefault(); if (isValid(g, p, 1, 0))  setPiece({ ...p, x: p.x + 1 }); break;
        case "ArrowDown":  e.preventDefault(); if (isValid(g, p, 0, 1))  setPiece({ ...p, y: p.y + 1 }); else lockAndSpawn(g, p); break;
        case "ArrowUp":    e.preventDefault(); { const r = rotate(p.shape); if (isValid(g, { ...p, shape: r })) setPiece({ ...p, shape: r }); } break;
        case " ":          e.preventDefault(); { let yy = p.y; while (isValid(g, p, 0, yy - p.y + 1)) yy++; lockAndSpawn(g, { ...p, y: yy }); } break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lockAndSpawn]);

  const startGame = () => {
    const g = emptyGrid();
    setGrid(g);
    setScore(0);
    setLevel(1);
    setIsGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    spawnPiece(g);
  };

  const handleLeft  = () => { const { piece: p, grid: g } = stateRef.current; if (p && isValid(g, p, -1, 0)) setPiece({ ...p, x: p.x - 1 }); };
  const handleRight = () => { const { piece: p, grid: g } = stateRef.current; if (p && isValid(g, p, 1, 0))  setPiece({ ...p, x: p.x + 1 }); };
  const handleDown  = () => { const { piece: p, grid: g } = stateRef.current; if (p) { if (isValid(g, p, 0, 1)) setPiece({ ...p, y: p.y + 1 }); else lockAndSpawn(g, p); } };
  const handleRotate = () => { const { piece: p, grid: g } = stateRef.current; if (p) { const r = rotate(p.shape); if (isValid(g, { ...p, shape: r })) setPiece({ ...p, shape: r }); } };

  // Build display grid (locked + falling piece)
  const displayGrid = piece ? placePiece(grid, piece) : grid;

  const cellSize = `${100 / COLS}%`;
  const rowSize  = `${100 / ROWS}%`;

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden select-none">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Tetris</p>
        <div className="flex gap-3 items-center">
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase text-white/20">Score</span>
              <span className="text-xs font-bold text-[rgb(0,167,157)]">{score}</span>
            </div>
            {highScore > 0 && (
              <div className="flex items-center gap-1">
                <Trophy size={8} className="text-white/15" />
                <span className="text-[9px] font-bold text-white/20">{highScore}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase text-white/20">Lv</span>
            <span className="text-[10px] font-bold text-white/40">{level}</span>
          </div>
          {isPlaying && !isGameOver && (
            <button onClick={() => setIsPaused(!isPaused)} className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all">
              {isPaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        className="relative bg-white/[0.02] border border-white/[0.05] rounded-lg overflow-hidden flex-1 w-full max-w-[160px]"
        style={{ aspectRatio: `${COLS}/${ROWS}` }}
      >
        {displayGrid.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <div
                key={`${r}-${c}`}
                className="absolute rounded-[1px]"
                style={{
                  width: cellSize,
                  height: rowSize,
                  left: `${(c * 100) / COLS}%`,
                  top: `${(r * 100) / ROWS}%`,
                  background: cell,
                  boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.3), 0 0 4px ${cell.replace('rgb', 'rgba').replace(')', ', 0.3)')}`,
                }}
              />
            ) : null
          )
        )}
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, transparent 1px, transparent ${100/ROWS}%, rgba(255,255,255,0.5) ${100/ROWS}%), repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0px, transparent 1px, transparent ${100/COLS}%, rgba(255,255,255,0.5) ${100/COLS}%)`,
          }}
        />

        {(isPaused || !isPlaying) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
            {isGameOver ? (
              <>
                <p className="text-sm font-bold text-red-500 mb-1">GAME OVER</p>
                <p className="text-[10px] text-white/40 mb-4">Score: {score}</p>
                <button onClick={startGame} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
                  <RotateCcw size={16} />
                </button>
              </>
            ) : isPaused ? (
              <>
                <p className="text-xs font-bold text-white mb-2">PAUSED</p>
                <button onClick={() => setIsPaused(false)} className="p-2 rounded-full bg-[rgb(0,167,157)] text-black">
                  <Play size={14} fill="currentColor" />
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-white mb-1">TETRIS</p>
                <p className="text-[9px] text-white/30 mb-4">↑ rotate · ↓ drop · space hard drop</p>
                <button onClick={startGame} className="p-3 rounded-full bg-[rgb(0,167,157)] text-black hover:scale-110 transition-all shadow-lg shadow-[rgb(0,167,157)]/20">
                  <Play size={20} fill="currentColor" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* D-pad */}
      <div className="grid grid-cols-3 gap-1 mt-3">
        <div />
        <button onMouseDown={handleRotate} onTouchStart={(e) => { e.preventDefault(); handleRotate(); }} className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors text-[9px] font-bold">↻</button>
        <div />
        <button onMouseDown={handleLeft} onTouchStart={(e) => { e.preventDefault(); handleLeft(); }} className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors">◀</button>
        <button onMouseDown={handleDown} onTouchStart={(e) => { e.preventDefault(); handleDown(); }} className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors">▼</button>
        <button onMouseDown={handleRight} onTouchStart={(e) => { e.preventDefault(); handleRight(); }} className="p-2 rounded-lg bg-white/[0.05] text-white/40 active:bg-[rgba(0,167,157,0.2)] active:text-[rgb(0,220,210)] transition-colors">▶</button>
      </div>
    </div>
  );
}
