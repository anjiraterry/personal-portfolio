"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function AnimatedText({ words, className, interval = 2500 }: AnimatedTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className={className} style={{ display: "inline-block", position: "relative" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}