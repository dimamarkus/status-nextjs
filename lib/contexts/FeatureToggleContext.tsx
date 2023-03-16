"use client";
import { createContext, useContext, useState } from "react";
import { OpenAiModel } from "#/app/chat/lib/openai";
import { DEFAULT_FEATURES } from "#/lib/constants/settings";

export type Font =
  | "sans"
  | "serif"
  // | "graphik"
  // | "tiempos"
  // | "tiemposHeadline"
  // | "avenir"
  // | "exo"
  // | "inter"
  // | "lato"
  // | "montserrat"
  // | "raleway";
export type Layout = "vertical" | "sidebar-left" | "sidebar-right";
export type Theme = "light" | "dark" | "statusAlt1" | "statusAlt2" | "statusAlt3";

export type Features = {
  font: Font;
  layout: Layout;
  theme: Theme;
  model: OpenAiModel;
  debugMode: boolean;
  useStream: boolean;
};

type ToggleContextType = {
  features: Features;
  setFeatures: (features: Features) => void;
  areFeaturesShown: boolean;
  toggleShowFeatures: () => void;
};

export const DEFAULT_FEATURE_CONTEXT = {
  features: DEFAULT_FEATURES,
  setFeatures: () => false,
  areFeaturesShown: false,
  toggleShowFeatures: () => false,
};

export const FeatureToggleContext = createContext<ToggleContextType>(DEFAULT_FEATURE_CONTEXT);

type FeatureToggleProps = {
  children: any;
};

export const FeatureToggleContextProvider = (props: FeatureToggleProps) => {
  const { children } = props;
  const [areFeaturesShown, setOptionsShown] = useState<boolean>(false);
  const [features, setFeatures] = useState<Features>(DEFAULT_FEATURES);
  return (
    <FeatureToggleContext.Provider
      value={{
        features,
        setFeatures,
        areFeaturesShown,
        toggleShowFeatures: () => setOptionsShown(!areFeaturesShown),
      }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};

export const useFeatureToggleContext = () => {
  return useContext(FeatureToggleContext);
};
