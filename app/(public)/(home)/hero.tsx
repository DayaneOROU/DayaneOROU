"use client";

import { useEffect, useRef, useState } from "react";
import ModelViewer from "@/components/lightswind/3d-model-viewer";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Icons } from "@/components/icon";

export default function Hero() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const modelWrapperRef = useRef<HTMLDivElement>(null);

  // contrôle si le canvas Three.js capte les events souris
  const [modelInteractive, setModelInteractive] = useState(false);

  // effet parallax tête sur mouvement souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * -10;
      avatarRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="hero-bg relative w-full h-screen overflow-hidden md:flex flex-col">

      {/* Modèle 3D — interactif uniquement au hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-10">
        <div
          ref={avatarRef}
          className="w-screen h-280"
          // zone de détection hover — plus large que le canvas
          onMouseEnter={() => setModelInteractive(true)}
          onMouseLeave={() => setModelInteractive(false)}
        >
          <ModelViewer
            url="/Modèle3d.glb"
            autoRotate={true}
            environmentPreset="studio"
            interactive={modelInteractive}
            
          />
        </div>
      </div>

      {/* Nom + titre */}
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

      {/* Dock */}
      <div className="absolute bottom-25 right-10 z-[10000]">
        <Dock iconMagnification={60} iconDistance={100}>
          <DockIcon>
            <Icons.gitHub className="size-full" />
          </DockIcon>
          <DockIcon>
            <Icons.googleDrive className="size-full" />
          </DockIcon>
          <DockIcon>
            <Icons.gmail className="size-full" />
          </DockIcon>
          <DockIcon>
            <Icons.whatsapp className="size-full" />
          </DockIcon>
        </Dock>
      </div>

      {/* Scroll indicator */}
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

      {/* <RetroGrid /> */}
    </section>
  );
}