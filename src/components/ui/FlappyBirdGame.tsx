"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Trophy } from "lucide-react";

const W = 240;
const H = 300;
const BIRD_X = 55;
const BIRD_W = 24;
const BIRD_H = 18;
const GRAVITY = 0.35;
const FLAP_VEL = -5.5;
const PIPE_W = 30;
const PIPE_GAP = 78;
const PIPE_SPEED = 2.0;
const PIPE_INTERVAL = 90;

type Pipe = { x: number; topH: number; passed: boolean };

export function FlappyBirdGame() {
  const [birdY, setBirdY] = useState(H / 2);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [birdAngle, setBirdAngle] = useState(0);
  const [newBest, setNewBest] = useState(false);

  const birdYRef      = useRef(H / 2);
  const birdVelRef    = useRef(0);
  const pipesRef      = useRef<Pipe[]>([]);
  const scoreRef      = useRef(0);
  const frameRef      = useRef(0);
  const isPlayingRef  = useRef(false);
  const isGameOverRef = useRef(false);
  const highScoreRef  = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("flappy_highscore");
    if (saved) { const v = parseInt(saved, 10); setHighScore(v); highScoreRef.current = v; }
  }, []);

  const flap = useCallback(() => {
    if (isGameOverRef.current) return;
    if (!isPlayingRef.current) { isPlayingRef.current = true; setIsPlaying(true); }
    birdVelRef.current = FLAP_VEL;
  }, []);

  const endGame = useCallback(() => {
    isPlayingRef.current  = false;
    isGameOverRef.current = true;
    setIsPlaying(false);
    setIsGameOver(true);
    if (scoreRef.current > highScoreRef.current) {
      highScoreRef.current = scoreRef.current;
      setHighScore(scoreRef.current);
      setNewBest(true);
      localStorage.setItem("flappy_highscore", String(scoreRef.current));
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (!isPlayingRef.current) return;
      frameRef.current++;

      // Physics
      birdVelRef.current  += GRAVITY;
      birdYRef.current    += birdVelRef.current;

      if (birdYRef.current - BIRD_H / 2 <= 0) { birdYRef.current = BIRD_H / 2; birdVelRef.current = 0; }
      if (birdYRef.current + BIRD_H / 2 >= H)  { endGame(); return; }

      setBirdY(birdYRef.current);
      setBirdAngle(Math.min(40, Math.max(-25, birdVelRef.current * 3)));

      // Spawn
      if (frameRef.current % PIPE_INTERVAL === 0) {
        const topH = 45 + Math.random() * (H - PIPE_GAP - 90);
        pipesRef.current = [...pipesRef.current, { x: W + 4, topH, passed: false }];
      }

      // Move
      pipesRef.current = pipesRef.current
        .map(p => ({ ...p, x: p.x - PIPE_SPEED }))
        .filter(p => p.x > -PIPE_W - 4);

      // Collision
      const bx1 = BIRD_X - BIRD_W / 2 + 4, bx2 = BIRD_X + BIRD_W / 2 - 4;
      const by1 = birdYRef.current - BIRD_H / 2 + 3, by2 = birdYRef.current + BIRD_H / 2 - 3;

      for (const p of pipesRef.current) {
        if (bx2 > p.x && bx1 < p.x + PIPE_W) {
          if (by1 < p.topH || by2 > p.topH + PIPE_GAP) { endGame(); return; }
        }
        if (!p.passed && p.x + PIPE_W < BIRD_X) {
          p.passed = true;
          scoreRef.current++;
          setScore(scoreRef.current);
        }
      }
      setPipes([...pipesRef.current]);
    }, 16);
    return () => clearInterval(id);
  }, [isPlaying, endGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  const startGame = () => {
    birdYRef.current = H / 2; birdVelRef.current = 0;
    pipesRef.current = []; scoreRef.current = 0; frameRef.current = 0;
    setBirdY(H / 2); setPipes([]); setScore(0); setBirdAngle(0); setNewBest(false);
    setIsGameOver(false); isGameOverRef.current = false;
    setIsPlaying(false); isPlayingRef.current = false;
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isGameOverRef.current) return;
    flap();
  };

  // Ground scroll
  const gOffset = (frameRef.current * PIPE_SPEED) % 40;

  // Wing flap angle
  const wingAngle = isPlaying && !isGameOver ? Math.sin(Date.now() / 80) * 25 : 0;

  return (
    <div className="flex flex-col h-full items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/[0.05] backdrop-blur-sm overflow-hidden select-none">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Flappy</p>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-white/20">Score</span>
            <span className="text-xs font-bold text-[rgb(0,167,157)]">{score}</span>
          </div>
          {highScore > 0 && <div className="flex items-center gap-1"><Trophy size={8} className="text-white/15"/><span className="text-[9px] font-bold text-white/20">{highScore}</span></div>}
        </div>
      </div>

      {/* Arena */}
      <div
        className="relative border border-white/[0.05] rounded-lg overflow-hidden w-full cursor-pointer"
        style={{
          aspectRatio:`${W}/${H}`, maxWidth:"220px", touchAction:"none",
          background: "linear-gradient(180deg, rgba(0,8,14,0.95) 0%, rgba(0,20,24,0.9) 60%, rgba(0,30,28,0.85) 100%)",
        }}
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {/* Stars */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{ width:1.5, height:1.5, background:"rgba(0,220,210,0.3)",
              left:`${(i*79+13)%100}%`, top:`${(i*61+7)%70}%` }} />
        ))}

        {/* Pipes */}
        {pipes.map((p, i) => (
          <React.Fragment key={i}>
            {/* Top pipe */}
            <div className="absolute"
              style={{ left:`${(p.x/W)*100}%`, top:0, width:`${(PIPE_W/W)*100}%`, height:`${(p.topH/H)*100}%`,
                background: "linear-gradient(90deg, rgba(0,80,74,0.9) 0%, rgba(0,140,130,0.85) 60%, rgba(0,100,92,0.9) 100%)",
                borderRight: "1px solid rgba(0,200,190,0.15)",
                borderBottom: "2px solid rgba(0,200,190,0.3)",
              }}>
              {/* Pipe cap */}
              <div className="absolute bottom-0 left-[-2px] right-[-2px] h-[8%]"
                style={{ background:"linear-gradient(90deg, rgba(0,100,92,0.95), rgba(0,180,170,0.7), rgba(0,100,92,0.95))",
                  borderBottom:"1px solid rgba(0,210,200,0.4)" }} />
            </div>
            {/* Bottom pipe */}
            <div className="absolute"
              style={{ left:`${(p.x/W)*100}%`, top:`${((p.topH+PIPE_GAP)/H)*100}%`,
                width:`${(PIPE_W/W)*100}%`, height:`${((H-p.topH-PIPE_GAP)/H)*100}%`,
                background: "linear-gradient(90deg, rgba(0,80,74,0.9) 0%, rgba(0,140,130,0.85) 60%, rgba(0,100,92,0.9) 100%)",
                borderRight: "1px solid rgba(0,200,190,0.15)",
                borderTop: "2px solid rgba(0,200,190,0.3)",
              }}>
              {/* Pipe cap */}
              <div className="absolute top-0 left-[-2px] right-[-2px] h-[8%]"
                style={{ background:"linear-gradient(90deg, rgba(0,100,92,0.95), rgba(0,180,170,0.7), rgba(0,100,92,0.95))",
                  borderTop:"1px solid rgba(0,210,200,0.4)" }} />
            </div>
          </React.Fragment>
        ))}

        {/* Bird */}
        <div className="absolute"
          style={{
            left:`${((BIRD_X - BIRD_W/2)/W)*100}%`,
            top:`${((birdY - BIRD_H/2)/H)*100}%`,
            width:`${(BIRD_W/W)*100}%`,
            height:`${(BIRD_H/H)*100}%`,
            transform:`rotate(${birdAngle}deg)`,
            transformOrigin: "center center",
          }}>
          {/* Body */}
          <div className="absolute inset-0 rounded-full"
            style={{ background:"linear-gradient(135deg, rgb(0,220,210), rgb(0,167,157))",
              boxShadow:"0 0 8px rgba(0,200,190,0.5)" }}/>
          {/* Belly */}
          <div className="absolute rounded-full"
            style={{ width:"50%", height:"45%", bottom:"10%", left:"10%",
              background:"rgba(0,240,230,0.25)" }}/>
          {/* Wing */}
          <div className="absolute rounded-full"
            style={{ width:"45%", height:"35%", top:"30%", left:"5%",
              background:"rgba(0,120,112,0.7)",
              transform:`rotate(${wingAngle}deg)`,
              transformOrigin:"right center" }}/>
          {/* Eye */}
          <div className="absolute bg-white rounded-full"
            style={{ width:"28%", height:"28%", top:"12%", right:"12%" }}>
            <div className="absolute bg-[rgb(20,20,30)] rounded-full" style={{ width:"55%", height:"55%", top:"20%", left:"20%" }}/>
          </div>
          {/* Beak */}
          <div className="absolute"
            style={{ width:"22%", height:"16%", top:"38%", right:"-4%",
              background:"rgb(0,200,190)",
              clipPath:"polygon(0% 0%, 100% 50%, 0% 100%)" }}/>
        </div>

        {/* Score in play */}
        {isPlaying && !isGameOver && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 font-display font-bold text-white/50 text-lg"
            style={{ textShadow:"0 0 12px rgba(0,167,157,0.4)" }}>
            {score}
          </div>
        )}

        {/* Scrolling ground */}
        <div className="absolute bottom-0 left-0 right-0 h-3 border-t border-[rgba(0,167,157,0.2)]"
          style={{
            backgroundImage:"repeating-linear-gradient(90deg, rgba(0,167,157,0.12) 0px, rgba(0,167,157,0.12) 2px, transparent 2px, transparent 40px)",
            backgroundPositionX:`-${gOffset}px`,
          }}
        />

        {/* Start overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 text-center p-4">
            <p className="text-sm font-bold text-white mb-1">FLAPPY</p>
            <p className="text-[9px] text-white/30 mb-4">tap · space · ↑ to flap</p>
            <div className="p-3 rounded-full bg-[rgb(0,167,157)] text-black shadow-lg shadow-[rgb(0,167,157)]/30">
              <Play size={20} fill="currentColor"/>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
            <p className="text-sm font-bold text-red-400 mb-1">DEAD</p>
            <p className="text-[10px] text-white/40 mb-1">Score: {score}</p>
            {newBest && <p className="text-[9px] text-[rgb(0,220,210)] mb-3" style={{ textShadow:"0 0 8px rgba(0,220,210,0.5)" }}>New best!</p>}
            <button onClick={(e)=>{e.stopPropagation();startGame();}}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white mb-2">
              <RotateCcw size={16}/>
            </button>
            <p className="text-[9px] text-white/20">tap to play again</p>
          </div>
        )}
      </div>

      <p className="text-[9px] text-white/15 mt-3 uppercase tracking-wider">tap or space to flap</p>
    </div>
  );
}
