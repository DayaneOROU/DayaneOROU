"use client";

// Icônes : MessageSquare remplace User pour l'entrée "Messages"
import { House, FolderOpenDot, FilePen, MessageSquare, LogOut } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link"; // Navigation client : plus de rechargement de page
import { usePathname } from "next/navigation";
import { HamburgerMenuOverlay } from "@/components/lightswind/hamburger-menu-overlay";

// Route racine du dashboard, utilisée pour la correspondance exacte
const DASHBOARD_ROOT = "/dayane/dashboard";

// Liens de navigation (source unique de vérité)
const links = [
  { label: "Dashboard", href: DASHBOARD_ROOT, icon: House },
  { label: "Projects", href: `${DASHBOARD_ROOT}/projects`, icon: FolderOpenDot },
  { label: "Blogs", href: `${DASHBOARD_ROOT}/blogs`, icon: FilePen },
  { label: "Messages", href: `${DASHBOARD_ROOT}/messages`, icon: MessageSquare },
];

// Version simplifiée pour le menu mobile (sans icônes)
const menuItems = links.map(({ label, href }) => ({ label, href }));

export default function NavbarAdmin() {
  const [menuOpen, setMenuOpen] = useState(false); // État du menu mobile
  const [scrolled, setScrolled] = useState(false); // true dès que la page défile
  const menuRef = useRef<HTMLDivElement>(null);    // Référence pour détecter le clic extérieur
  const pathname = usePathname();                  // Route courante

  // CORRECTION 1 : écouteur de scroll (absent dans l'original)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll(); // Initialise l'état au montage (page déjà scrollée après refresh)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer le menu mobile à chaque changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // CORRECTION 2 : "Dashboard" actif uniquement sur sa propre page,
  // les autres liens restent actifs sur leurs sous-routes
  const isActive = (href: string) => {
    if (href === DASHBOARD_ROOT) return pathname === DASHBOARD_ROOT;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // CORRECTION 3 : handler de déconnexion (à brancher sur votre logique d'auth)
  const handleLogout = async () => {
    // TODO : ex. await supabase.auth.signOut(); router.push("/login");
    console.log("Déconnexion");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-5">
      {/* CORRECTION 4 : pleine largeur sur mobile, 80 % seulement à partir de lg */}
      <div className="mx-auto w-full lg:max-w-[80%]">
        <div
          className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl border px-3 transition-all duration-500 sm:min-h-[72px] sm:rounded-3xl sm:px-5 lg:px-6 ${
            scrolled
              ? "border-zinc-200/80 bg-white/95 shadow-xl shadow-zinc-900/[0.08] dark:border-white/[0.12] dark:bg-[#202124]/95 dark:shadow-black/25"
              : "border-zinc-200/60 bg-white/80 shadow-lg shadow-zinc-900/[0.05] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#48494d]/85"
          }`}
        >
          {/* Logo : version claire / version sombre */}
          <Link
            href={DASHBOARD_ROOT}
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
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation admin">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined} // Accessibilité
                  // CORRECTION 5 : classes de couleur mutuellement exclusives
                  className={`group inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-base font-medium transition-all lg:px-3.5 lg:text-lg ${
                    active
                      ? " text-[#d97706] underline underline-offset-6"
                      : "text-gray-900 hover:text-[#277861] dark:text-zinc-300 dark:hover:text-emerald-300"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.9}
                    className="transition-transform group-hover:-translate-y-0.5"
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2.5 text-xs font-semibold text-red-500 transition hover:scale-110 sm:px-3 dark:text-red-300 dark:hover:text-red-200"
              aria-label="Déconnexion"
            >
              <LogOut size={16} strokeWidth={2} />
              <span className="hidden lg:inline">Déconnexion</span>
            </button>

            {/* Navigation mobile : réactivée (elle était commentée) */}
            <div ref={menuRef} className="md:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
                <HamburgerMenuOverlay items={menuItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}