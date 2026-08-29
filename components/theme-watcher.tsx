"use client";

import { useEffect } from "react";

export default function ThemeWatcher() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function applyMode(e: MediaQueryListEvent | MediaQueryList) {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    applyMode(media);
    media.addEventListener("change", applyMode);

    return () => media.removeEventListener("change", applyMode);
  }, []);

  return null;
}