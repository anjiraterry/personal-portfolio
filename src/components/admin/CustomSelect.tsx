"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export function CustomSelect({ value, onChange, options, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] focus:bg-white/[0.05] outline-none transition-all cursor-pointer text-left"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={16} className={cn("text-white/30 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-[rgb(20,24,28)] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 backdrop-blur-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer block",
                opt.value === value 
                  ? "bg-[rgb(0,167,157,0.15)] text-[rgb(0,200,188)] font-semibold" 
                  : "text-white/70 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
