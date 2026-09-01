"use client";

import { House, FolderOpenDot, FilePen, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ShinyButton } from "@/components/ui/shiny-button";

const links = [
  { label: "Accueil", href: "/", icon: House },
  { label: "Projects", href: "/projects", icon: FolderOpenDot },
  { label: "Blogs", href: "/blogs", icon: FilePen },
  { label: "Contacts", href: "/contact", icon: User },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fermer le menu mobile quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none ">
        <div className="flex justify-center">
          <div
            className={`
                px-25 flex justify-between
                items-center
                text-gray-700
                bg-gray-100           
                mx-auto
                transition duration-500 ease-in

            ${
              scrolled
                ? `
                mt-4
                w-[calc(100%-32px)]
                max-w-5xl
                rounded-3xl
                bg-white/85
                backdrop-blur-xl
                shadow-xl
                dark:bg-[#48494d]
                
                `
                : `
                mt-4
                w-full
                bg-transparent
              `
            }
        `}
          >
            <div>
              <>
                <img
                  src="/dayaneorouN.png"
                  className="block dark:hidden w-18 p-2  "
                />
                <img
                  src="/dayaneorou.png"
                  className="hidden dark:block w-18 p-2 "
                />
              </>
            </div>
            <div className="flex justify-between gap-5 font-inter text-primary">
              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <a key={link.href} href={link.href} className="flex gap-1 ">
                    <Icon />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
            <div>
                <ShinyButton className="rounded-4xl bg-amber-100 py-2 px-3 ">
                  <a href="" className="text-gray-900 font-bold ">
                    UNE IDEE DE PROJET ?
                  </a>
                </ShinyButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
