"use client"; // Page entièrement côté navigateur, comme votre page Lieux

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, Folder, ListFilter, Search } from "lucide-react";
import AddProjectModal from "@/components/add-project-modal";
import Dashcard from "@/components/dashcard";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { getProjects } from "@/lib/actions/projects";
import { getStacks } from "@/lib/actions/stacks";
import { getCategories } from "@/lib/actions/categories";
import type { Projects, ProjectCategories, Stacks } from "@/types";

type Filter = "all" | "published" | "draft";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Tous",
  published: "Publiés",
  draft: "Brouillons",
};

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

const supabase = createBrowserSupabase();

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [stacks, setStacks] = useState<Pick<Stacks, "id" | "name">[]>([]);
  const [categories, setCategories] = useState<ProjectCategories[]>([]);
  const [loading, setLoading] = useState(true); // Premier chargement
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Charge projets, stacks et catégories en parallèle
  const fetchData = useCallback(async () => {
    const [proj, stk, cat] = await Promise.all([
      getProjects(),
      getStacks(),
      getCategories(),
    ]);

    if (proj.error) {
      console.error(proj.error);
      setLoadError("Erreur de chargement des projets.");
    } else {
      setLoadError(null);
      setProjects((proj.data as Projects[]) ?? []);
    }
    setStacks(stk.data ?? []);
    setCategories(cat.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Ferme le menu « Trier » au clic extérieur ou sur Échap
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Compteurs (cartes de stats ET menu de filtre)
  const counts = useMemo(() => {
    const published = projects.filter((p) => p.published).length;
    return {
      all: projects.length,
      published,
      draft: projects.length - published,
    };
  }, [projects]);

  // Liste affichée : filtre publié/brouillon, puis recherche texte
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return projects.filter((p) => {
      if (filter === "published" && !p.published) return false;
      if (filter === "draft" && p.published) return false;
      if (!q) return true;
      return normalize(
        `${p.title} ${p.description ?? ""} ${p.slug} ${p.category?.name ?? ""}`,
      ).includes(q);
    });
  }, [projects, query, filter]);

  const isFiltering = query.trim() !== "" || filter !== "all";

  // Premier chargement
  if (loading) {
    return (
      <div className="pt-30 lg:px-40 md:px-10 px-5 p-8 text-sm text-zinc-500">
        Chargement des projets…
      </div>
    );
  }

  // Erreur de chargement
  if (loadError) {
    return <p className="p-5 text-sm text-red-400 sm:p-8">{loadError}</p>;
  }

  return (
    <div className="admin-padding min-h-screen pb-16 text-zinc-900 dark:bg-[#101112] dark:text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* ── En-tête ── */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-inter text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-7xl">
              Projets
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Gérez les projets qui composent votre portfolio.
            </p>
          </div>

          {/* onCreated : recharge la liste après un ajout réussi */}
          <AddProjectModal
            stacks={stacks}
            categories={categories}
            onCreated={fetchData}
          />
        </div>

        {/* ── Stats rapides ── */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:mb-10 lg:gap-10">
          <Dashcard
            title="Total"
            count={counts.all}
            description="projets"
            variant="default"
          />
          <Dashcard
            title="Publiés"
            count={counts.published}
            description="visibles sur le portfolio"
            variant="vert"
          />
          <Dashcard
            title="Brouillons"
            count={counts.draft}
            description="non publiés"
            variant="default"
          />
        </div>

        {/* ── Barre recherche + filtre ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un projet..."
              className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white/80 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#277861] focus:ring-2 focus:ring-[#277861]/15 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="relative w-full sm:w-auto" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861]/40 sm:w-auto dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
            >
              <ListFilter size={16} />
              Trier
              {filter !== "all" && (
                <span className="rounded-full bg-[#277861]/10 px-2 py-0.5 text-[11px] text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
                  {FILTER_LABELS[filter]}
                </span>
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-full min-w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-white/[0.1] dark:bg-[#191a1c] sm:w-56"
              >
                {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setFilter(key);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                  >
                    <span className="flex items-center gap-2">
                      {filter === key ? (
                        <Check
                          size={14}
                          className="text-[#277861] dark:text-emerald-400"
                        />
                      ) : (
                        <span className="w-3.5" />
                      )}
                      {FILTER_LABELS[key]}
                    </span>
                    <span className="text-xs text-zinc-400">{counts[key]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compteur de résultats, visible seulement quand on filtre */}
        {isFiltering && (
          <p className="mb-4 text-sm text-zinc-500">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            {query.trim() && <> pour « {query.trim()} »</>}
          </p>
        )}

        {/* ── Grille projets ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 py-20 text-center dark:border-white/[0.12] dark:bg-white/[0.025] sm:py-24">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
              <Folder size={26} />
            </div>
            <p className="mb-1 font-semibold">
              {isFiltering
                ? "Aucun projet ne correspond"
                : "Aucun projet pour l'instant"}
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              {isFiltering
                ? "Modifiez votre recherche ou changez de filtre."
                : "Utilisez le bouton « Ajouter un projet » en haut de la page."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#277861]/35 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-white/[0.08] dark:bg-[#191a1c] dark:hover:border-emerald-400/25 dark:hover:shadow-black/20"
              >
                {/* Image du projet, avec repli si absente */}
                <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800 sm:h-44">
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                      <Folder
                        size={30}
                        className="text-zinc-300 dark:text-zinc-700"
                      />
                    </div>
                  )}

                  {/* Badge déduit du booléen published */}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${
                      project.published
                        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border border-white/10 bg-white/[0.06] text-zinc-400"
                    }`}
                  >
                    {project.published ? "Publié" : "Brouillon"}
                  </span>
                </div>

                {/* Contenu de la carte */}
                <div className="p-4 sm:p-5">
                  {project.category?.name && (
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#277861] dark:text-emerald-400">
                      {project.category.name}
                    </p>
                  )}

                  <h2 className="mb-5 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-zinc-900 dark:text-white">
                    {project.title}
                  </h2>

                  <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-white/[0.08]">
                    <span className="text-[11px] text-zinc-500">
                      {formatDate(project.created_at)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861] dark:hover:bg-white/[0.08] dark:hover:text-white"
                          title="Voir le projet"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}

                      <Link
                        href={`/dayane/dashboard/projects/${project.id}`}
                        className="inline-flex min-h-8 items-center rounded-lg px-2 text-xs font-semibold text-[#277861] transition hover:bg-[#277861]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861] dark:text-emerald-400 dark:hover:bg-emerald-400/10"
                      >
                        Éditer{" "}
                        <span className="ml-1 transition-transform group-hover:translate-x-0.5">
                        →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
