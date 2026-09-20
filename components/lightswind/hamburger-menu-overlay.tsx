"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface HamburgerMenuOverlayProps {
  items: MenuItem[];
  buttonSize?: "sm" | "md" | "lg";
  buttonColor?: string;
  overlayBackground?: string;
  textColor?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  fontFamily?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  animationDuration?: number;
  staggerDelay?: number;
  className?: string;
  buttonClassName?: string;
  menuItemClassName?: string;
  keepOpenOnItemClick?: boolean;
  customButton?: React.ReactNode;
  ariaLabel?: string;
  onOpen?: () => void;
  onClose?: () => void;
  zIndex?: number;
}

export const HamburgerMenuOverlay: React.FC<HamburgerMenuOverlayProps> = ({
  items = [],
  buttonSize = "md",
  buttonColor = "#6c8cff",
  overlayBackground = "#6c8cff",
  textColor = "#ffffff",
  fontSize = "md",
  fontFamily = '"Krona One", monospace',
  fontWeight = "bold",
  animationDuration = 1.5,
  staggerDelay = 0.1,
  className,
  buttonClassName,
  menuItemClassName,
  keepOpenOnItemClick = false,
  customButton,
  ariaLabel = "Navigation menu",
  onOpen,
  onClose,
  zIndex = 1000,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const fontSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) onOpen?.();
    else onClose?.();
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) item.onClick();
    if (item.href && !item.onClick) window.location.href = item.href;
    if (!keepOpenOnItemClick) {
      setIsOpen(false);
      onClose?.();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Krona+One:wght@400&display=swap');

        .hmb-overlay-${zIndex} {
          position: fixed;
          top: 0;
          right: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          background: ${overlayBackground};
          z-index: ${zIndex};
          clip-path: circle(0px at calc(100% - 40px) 40px);
          transition: clip-path ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
        }

        .hmb-overlay-${zIndex}.open {
          clip-path: circle(150% at calc(100% - 40px) 40px);
          pointer-events: all;
        }

        .hmb-item-${zIndex} {
          position: relative;
          list-style: none;
          padding: 0.5rem 0;
          cursor: pointer;
          transform: translateX(200px);
          opacity: 0;
          transition: all 0.3s ease;
          font-family: ${fontFamily};
          font-weight: ${fontWeight};
          color: ${textColor};
          text-align: right;
        }

        .hmb-item-${zIndex}.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .hmb-item-${zIndex} span {
          opacity: 0.7;
          transition: opacity 0.25s ease;
        }

        .hmb-item-${zIndex}:hover span {
          opacity: 1;
        }
      `}</style>

      {/* Overlay */}
      <div className={cn(`hmb-overlay-${zIndex}`, isOpen && "open")}
        aria-hidden={!isOpen}
      >
        <ul className="pr-12 pb-20">
          {items.map((item, index) => (
            <li
              key={index}
              className={cn(
                `hmb-item-${zIndex}`,
                fontSizes[fontSize],
                isOpen && "visible",
                menuItemClassName
              )}
              style={{ transitionDelay: isOpen ? `${index * staggerDelay}s` : "0s" }}
              onClick={() => handleItemClick(item)}
              tabIndex={isOpen ? 0 : -1}
              role="button"
            >
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton hamburger — inline, pas absolu */}
      <button
        className={cn(buttonSizes[buttonSize], buttonClassName, "rounded-xl flex items-center justify-center")}
        style={{ background: buttonColor, zIndex: zIndex + 1, position: "relative" }}
        onClick={toggleMenu}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        {customButton || (
          <div className="relative w-full h-full flex items-center justify-center">
            <Menu
              className={cn("absolute transition-all duration-300",
                isOpen ? "opacity-0 rotate-45 scale-0" : "opacity-100 rotate-0 scale-100"
              )}
              size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
              color={textColor}
            />
            <X
              className={cn("absolute transition-all duration-300",
                isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-0"
              )}
              size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
              color={textColor}
            />
          </div>
        )}
      </button>
    </>
  );
};

export default HamburgerMenuOverlay;