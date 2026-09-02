"use client";

import {
  Children,
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StackedSectionsProps {
  children: ReactNode;
  className?: string;
}

export default function StackedSections({
  children,
  className = "",
}: StackedSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const sections = gsap.utils.toArray<HTMLElement>(
      "[data-stacked-section]",
      container
    );

    if (sections.length < 2) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ============================================================
      // DESKTOP / TABLET
      // ============================================================
      mm.add("(min-width: 768px)", () => {
        sections.forEach((section, index) => {
          const nextSection = sections[index + 1];

          if (!nextSection) return;

          // État initial
          gsap.set(section, {
            scale: 1,
            opacity: 1,
            y: 0,
            transformOrigin: "center center",
            force3D: true,
          });

          gsap.to(section, {
            scale: 0.70,
            opacity: 0.72,
            y: -8,

            ease: "none",

            scrollTrigger: {
              trigger: nextSection,

              // La transition commence dès que
              // la nouvelle section entre dans l'écran
              start: "top bottom",

              // Elle se termine lorsque la nouvelle
              // section arrive complètement en haut
              end: "top top",

              scrub: 0.8,

              invalidateOnRefresh: true,
            },
          });
        });
      });

      // ============================================================
      // MOBILE
      // ============================================================
      mm.add("(max-width: 767px)", () => {
        sections.forEach((section, index) => {
          const nextSection = sections[index + 1];

          if (!nextSection) return;

          gsap.set(section, {
            scale: 1,
            opacity: 1,
            y: 0,
            transformOrigin: "center center",
            force3D: true,
          });

          gsap.to(section, {
            scale: 0.985,
            opacity: 0.9,

            ease: "none",

            scrollTrigger: {
              trigger: nextSection,
              start: "top bottom",
              end: "top top",

              scrub: 0.5,

              invalidateOnRefresh: true,
            },
          });
        });
      });

      // ============================================================
      // ACCESSIBILITÉ
      // ============================================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        sections.forEach((section) => {
          gsap.set(section, {
            scale: 1,
            opacity: 1,
            y: 0,
          });
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative isolate ${className}`}
    >
      {Children.map(children, (child, index) => (
        <section
          data-stacked-section
          className="
            sticky
            top-0
            h-screen
            w-full
            overflow-hidden
            will-change-transform
          "
          style={{
            zIndex: index + 1,
          }}
        >
          {child}
        </section>
      ))}
    </div>
  );
}