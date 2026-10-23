import React, { createContext, useContext, useState } from "react";
import { playClang } from "./clang";

const SOUND_KEY = "gymRecords.sound";

const readSoundPref = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
};

const SoundContext = createContext({ soundOn: false, toggleSound: () => {} });

// Sound is off by default; the choice is remembered per browser
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundOn, setSoundOn] = useState(readSoundPref);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      // storage blocked (private mode); the toggle still works for this visit
    }
    if (next) playClang();
  };

  return (
    <SoundContext.Provider value={{ soundOn, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
