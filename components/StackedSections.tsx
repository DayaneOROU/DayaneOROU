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

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>(
        "[data-stacked-section]"
      )
    );

    if (sections.length < 2) return;

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        if (index === sections.length - 1) return;

        const nextSection = sections[index + 1];

        gsap.to(section, {
          scale: 0.92,
          filter: "blur(6px)",
          opacity: 0.65,

          ease: "none",

          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      {Children.map(children, (child, index) => (
        <section
          data-stacked-section
          className="sticky top-0 h-screen w-full overflow-hidden"
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