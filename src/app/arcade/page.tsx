"use client";

import { motion } from "framer-motion";
import { SnakeGame } from "@/components/ui/SnakeGame";
import { TetrisGame } from "@/components/ui/TetrisGame";
import { PongGame } from "@/components/ui/PongGame";
import { BreakoutGame } from "@/components/ui/BreakoutGame";
import { SpaceInvadersGame } from "@/components/ui/SpaceInvadersGame";
import { FlappyBirdGame } from "@/components/ui/FlappyBirdGame";

const GAMES = [
  { id: "snake",    component: SnakeGame },
  { id: "tetris",   component: TetrisGame },
  { id: "pong",     component: PongGame },
  { id: "breakout", component: BreakoutGame },
  { id: "invaders", component: SpaceInvadersGame },
  { id: "flappy",   component: FlappyBirdGame },
];

export default function ArcadePage() {
  return (
    <div className="min-h-screen pt-[100px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3">
            — You found it —
          </p>
          <h1
            className="font-display font-bold text-white/90 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            Arcade
          </h1>
          <p className="text-white/30 mt-2 text-sm max-w-sm">
            Six classics. No quarters needed.
          </p>
        </motion.div>

        {/* 3×2 game grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map(({ id, component: Game }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={[
                "relative rounded-2xl overflow-hidden",
                "border border-white/[0.06]",
                "bg-[rgba(14,18,22,0.8)] backdrop-blur-xl",
                "hover:border-[rgba(0,167,157,0.15)]",
                "hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,167,157,0.08)]",
                "transition-all duration-400",
              ].join(" ")}
              style={{ minHeight: "520px" }}
            >
              {/* Noise overlay */}
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px",
                }}
              />
              <div className="relative z-10 h-full p-6 flex flex-col" style={{ minHeight: "520px" }}>
                <Game />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-[10px] uppercase tracking-[0.2em] text-white/15 mt-12"
        >
          High scores saved locally
        </motion.p>
      </div>
    </div>
  );
}
