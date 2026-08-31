"use client";

import React, { createContext, useContext, useCallback } from "react";
import { logInteraction, submitRecommendationFeedback } from "../lib/api";
import { useAuth } from "./AuthContext";

interface InteractionTrackerContextType {
  trackView: (restaurantId: number, metadata?: Record<string, any>) => void;
  trackClick: (restaurantId: number, metadata?: Record<string, any>) => void;
  trackFeedback: (restaurantId: number, type: "like" | "dislike", source?: string) => Promise<void>;
}

const InteractionTrackerContext = createContext<InteractionTrackerContextType | undefined>(undefined);

export const InteractionTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const trackView = useCallback(
    (restaurantId: number, metadata?: Record<string, any>) => {
      logInteraction(restaurantId, "view", user?.id, metadata);
    },
    [user?.id]
  );

  const trackClick = useCallback(
    (restaurantId: number, metadata?: Record<string, any>) => {
      logInteraction(restaurantId, "click", user?.id, metadata);
    },
    [user?.id]
  );

  const trackFeedback = useCallback(
    async (restaurantId: number, type: "like" | "dislike", source: string = "hybrid") => {
      await submitRecommendationFeedback(restaurantId, type, user?.id);
    },
    [user?.id]
  );

  return (
    <InteractionTrackerContext.Provider value={{ trackView, trackClick, trackFeedback }}>
      {children}
    </InteractionTrackerContext.Provider>
  );
};

export const useInteractionTracker = () => {
  const context = useContext(InteractionTrackerContext);
  if (!context) throw new Error("useInteractionTracker must be used within InteractionTrackerProvider");
  return context;
};
