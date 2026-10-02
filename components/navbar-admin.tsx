"use client";

import { House, FolderOpenDot, FilePen, User, LogOut } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HamburgerMenuOverlay } from "@/components/lightswind/hamburger-menu-overlay";

const links = [
  { label: "Dashboard", href: "/dayane/dashboard", icon: House },
  {
    label: "Projects",
    href: "/dayane/dashboard/projects",
    icon: FolderOpenDot,
  },
  { label: "Blogs", href: "/dayane/dashboard/blogs", icon: FilePen },
  { label: "Messages", href: "/dayane/dashboard/messages", icon: User },
];

const menuItems = links.map(({ label, href }) => ({ label, href }));

export default function NavbarAdmin() {
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
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl border px-3 transition-all duration-500 sm:min-h-[72px] sm:rounded-3xl sm:px-5 lg:px-6 ${
            scrolled
              ? "border-zinc-200/80 bg-white/95 shadow-xl shadow-zinc-900/[0.08] dark:border-white/[0.12] dark:bg-[#202124]/95 dark:shadow-black/25"
              : "border-zinc-200/60 bg-white/80 shadow-lg shadow-zinc-900/[0.05] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#48494d]/85"
          }`}
        >
          {/* Brand */}
          <a
            href="/dayane/dashboard"
            aria-label="Retour au dashboard"
            className="shrink-0 rounded-xl transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861]"
          >
            <img
              src="/dayaneorouN.png"
              alt="Dayane OROU"
              className="block h-11 w-16 object-contain p-1 dark:hidden sm:h-12 sm:w-[70px]"
            />
            <img
              src="/dayaneorou.png"
              alt="Dayane OROU"
              className="hidden h-11 w-16 object-contain p-1 dark:block sm:h-12 sm:w-[70px]"
            />
          </a>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation admin">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="group inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-base font-medium text-gray-900 transition-all  hover:text-[#277861] lg:px-3.5 lg:text-lg dark:text-zinc-300 dark:hover:text-emerald-300"
                >
                  <Icon size={16} strokeWidth={1.9} className="transition-transform group-hover:-translate-y-0.5" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2.5 text-xs font-semibold text-red-500 transition hover:scale-110 sm:px-3 dark:text-red-300 dark:hover:text-red-200"
              aria-label="Déconnexion"
            >
              <LogOut size={16} strokeWidth={2} />
              <span className="hidden lg:inline">Déconnexion</span>
            </button>

            {/* Navigation mobile */}
            <div ref={menuRef} className="md:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
                {/* <HamburgerMenuOverlay items={menuItems} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
