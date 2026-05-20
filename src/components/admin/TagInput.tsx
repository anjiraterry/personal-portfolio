"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function TagInput({ tags = [], onChange, placeholder = "Add tag...", label }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      onChange(updated);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] focus:bg-white/[0.05] outline-none transition-all"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 bg-[rgb(0,167,157,0.1)] border border-[rgb(0,167,157,0.2)] text-[rgb(0,167,157)] rounded-xl hover:bg-[rgb(0,167,157,0.2)] transition-all flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgb(0,167,157,0.06)] border border-[rgb(0,167,157,0.15)] text-[rgb(0,180,170)] text-[10px] font-bold uppercase tracking-wider"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-400 transition-colors flex items-center justify-center"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
