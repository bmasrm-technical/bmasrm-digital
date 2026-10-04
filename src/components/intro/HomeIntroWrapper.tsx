"use client";

import React, { useState, useSyncExternalStore } from "react";
import Intro3D from "@/components/intro/Intro3D";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getClientSnapshot(): boolean {
  try {
    return sessionStorage.getItem("bmasrm_intro_seen") === "true";
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function HomeIntroWrapper() {
  const isIntroSeen = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setIsFadingOut(true);
    try {
      sessionStorage.setItem("bmasrm_intro_seen", "true");
      document.documentElement.classList.add("intro-seen");
    } catch {
      // ignore
    }
    setTimeout(() => {
      setCompleted(true);
    }, 700);
  };

  if (isIntroSeen || completed) return null;

  return (
    <div
      id="intro-overlay-container"
      className={`fixed inset-0 z-50 bg-[#0A0908] transition-opacity duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Intro3D onComplete={handleComplete} />
    </div>
  );
}
