"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getPortfolioData } from "@/lib/data-fetcher";
import * as staticData from "@/data/portfolio";

type PortfolioData = {
  personal: any;
  metrics: any[];
  techStack: any[];
  expertise: any[];
  experience: any[];
  education: any[];
  projects: any[];
  focusAreas: any[];
  notes: any[];
  philosophy: any[];
};

type PortfolioContextType = {
  data: PortfolioData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextType>({
  data: {
    personal: staticData.PERSONAL,
    metrics: staticData.METRICS,
    techStack: staticData.TECH_STACK,
    expertise: staticData.EXPERTISE,
    experience: staticData.EXPERIENCE,
    education: staticData.EDUCATION,
    projects: staticData.PROJECTS,
    focusAreas: staticData.FOCUS_AREAS,
    notes: staticData.NOTES,
    philosophy: (staticData as any).PHILOSOPHY || [],
  },
  isLoading: true,
  refreshData: async () => {},
});

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<PortfolioData>({
    personal: staticData.PERSONAL,
    metrics: staticData.METRICS,
    techStack: staticData.TECH_STACK,
    expertise: staticData.EXPERTISE,
    experience: staticData.EXPERIENCE,
    education: staticData.EDUCATION,
    projects: staticData.PROJECTS,
    focusAreas: staticData.FOCUS_AREAS,
    notes: staticData.NOTES,
    philosophy: (staticData as any).PHILOSOPHY || [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const dynamicData = await getPortfolioData();
      
      // Only update if we actually got data back from Supabase
      // Otherwise fallback to static data
      setData({
        personal: dynamicData.personal || staticData.PERSONAL,
        metrics: dynamicData.metrics.length > 0 ? dynamicData.metrics : staticData.METRICS,
        techStack: dynamicData.techStack.length > 0 ? dynamicData.techStack : staticData.TECH_STACK,
        expertise: dynamicData.expertise.length > 0 ? dynamicData.expertise : staticData.EXPERTISE.map(name => ({ name })),
        experience: dynamicData.experience.length > 0 ? dynamicData.experience : staticData.EXPERIENCE,
        education: dynamicData.education.length > 0 ? dynamicData.education : staticData.EDUCATION,
        projects: dynamicData.projects.length > 0 ? dynamicData.projects : staticData.PROJECTS,
        focusAreas: dynamicData.focusAreas.length > 0 ? dynamicData.focusAreas : staticData.FOCUS_AREAS,
        notes: dynamicData.notes.length > 0 ? dynamicData.notes : staticData.NOTES,
        philosophy: dynamicData.philosophy.length > 0 ? dynamicData.philosophy : ((staticData as any).PHILOSOPHY || []),
      });
    } catch (err) {
      console.error("Failed to fetch dynamic portfolio data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <PortfolioContext.Provider value={{ data, isLoading, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
