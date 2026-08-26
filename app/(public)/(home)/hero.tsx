"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const avatarRef = useRef<HTMLDivElement>(null);

  // Légère rotation de l'avatar au mouvement de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * -10;
      avatarRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#1A1A1A] overflow-hidden  md:flex flex-col">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-10 py-7">
        <span className="text-[#D0CDC9] text-xs font-bold tracking-[0.14em] uppercase">
          D.OROU
        </span>
        <ul className="flex gap-8">
          {["Projets", "Blog", "Contact"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-[#918981] text-[11px] tracking-[0.1em] uppercase hover:text-[#D0CDC9] transition-colors duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#6B8F71] animate-pulse" />
          <span className="text-[#918981] text-[10px] tracking-[0.08em] uppercase">
            Open to work
          </span>
        </div>
      </nav>

      {/* Halo radial derrière l'avatar */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{ background: "var(--glow)" }}
      />

      {/* Avatar 3D — centré */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-10">
        <div
          ref={avatarRef}
          className="transition-transform duration-75 ease-out"
          style={{ transformStyle: "preserve-3d", perspective: "600px" }}
        >
          {/*
            Remplacez ce div par votre composant <Avatar3D /> React Three Fiber
            qui charge votre fichier .glb depuis /public/avatar.glb
          */}
          <div className="w-[200px] h-[240px] rounded-xl bg-[#222] border border-[#2c2c2c] flex items-center justify-center text-[#918981] text-xs tracking-widest">
            AVATAR 3D
          </div>
        </div>
      </div>

      {/* Nom — bas gauche */}
      <div className="absolute bottom-10 left-10 z-10">
        <h1 className="text-[#E8DCC8] font-bebas text-9xl font-bold tracking-wider">
          DAYANE OROU
        </h1>
        <p className="text-[#918981] text-xl tracking-[0.22em] uppercase mt-3 font-light">
          Full Stack Dev Junior
        </p>
      </div>

      {/* Scroll hint — bas droite */}
      <div className="absolute bottom-12 right-10 z-10 flex flex-col items-center gap-1">
        <span className="text-[#3a3a3a] text-[9px] tracking-[0.16em] uppercase">
          Scroll
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1v10M2 7l4 4 4-4"
            stroke="#3a3a3a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
