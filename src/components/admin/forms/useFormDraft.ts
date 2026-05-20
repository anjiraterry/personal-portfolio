"use client";

import { useState, useEffect } from "react";

export function useFormDraft<T>(key: string, initialValue: T, isCreateMode: boolean): [T, (val: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined" || !isCreateMode) return initialValue;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch (e) {
      console.error(e);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined" || !isCreateMode) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [key, state, isCreateMode]);

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  return [state, setState, clearDraft];
}
