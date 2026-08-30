"use client";

import { useEffect, useRef } from "react";
import ModelViewer from "@/components/lightswind/3d-model-viewer";
import { RetroGrid } from "@/components/ui/retro-grid"
export default function Hero() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const medialink = [
    { label: "Github", href: "" },
    { label: "Mail", href: "/Contact" },
    { label: "Whatssap", href: "" },
  ];
  useEffect(() => {
    const handleMouseMove: (e: MouseEvent) => void = (e: MouseEvent) => {
      if (!avatarRef.current) return;

      const { innerWidth, innerHeight } = window;

      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * -10;

      avatarRef.current.style.transform = `
        rotateY(${x}deg)
        rotateX(${y}deg)
      `;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="hero-bg relative w-full h-screen overflow-hidden md:flex flex-col">

      {/* <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#6B8F71] animate-pulse" />
          <span
            className="text-[10px] tracking-[0.08em] uppercase"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Open to work
          </span>
        </div> */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-10">
        <div ref={avatarRef} className="w-screen h-280">
          <ModelViewer
            url="/Modèle3d.glb"
            autoRotate={true}
            environmentPreset="studio"
          />
        </div>
      </div>

      {/* Nom */}
      <div className="absolute bottom-18 left-10 z-20">
        <h1
          className="font-russo text-8xl font-bold tracking-[0em]"
          style={{ color: "var(--color-text-primary)" }}
        >
          Dayane OROU
        </h1>

        <p
          className="text-xl tracking-[0.22em] uppercase mt-3 font-light"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Full Stack Dev Junior
        </p>
      </div>

      <div></div>

      {/* Scroll */}
      <div className="absolute bottom-12 right-10 z-20 flex flex-col items-center gap-1">
        <span
          className="text-[9px] tracking-[0.16em] uppercase"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Scroll
        </span>

        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1v10M2 7l4 4 4-4"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <RetroGrid />
    </section>
  );
}
