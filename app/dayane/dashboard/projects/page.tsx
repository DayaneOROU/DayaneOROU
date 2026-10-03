// app/dayane/dashboard/projects/page.tsx
import AddProjectModal from "@/components/add-project-modal";
import Dashcard from "@/components/dashcard";
import { createSupabaseServer } from "@/lib/supabase-server";
import { Plus, ListFilter, ExternalLink, Folder, Search } from "lucide-react";
import Link from "next/link";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Formate la date "2024-01-15T..." → "Jan 2024"
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

// Couleur du badge selon le statut
function statusStyle(status: string) {
  switch (status) {
    case "published":
      return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "draft":
      return "border border-white/10 bg-white/[0.06] text-zinc-400";
    case "archived":
      return "border border-red-400/20 bg-red-400/10 text-red-300";
    default:
      return "border border-white/10 bg-white/[0.06] text-zinc-500";
  }
}

// Libellé lisible du statut
function statusLabel(status: string) {
  const labels: Record<string, string> = {
    published: "Publié",
    draft: "Brouillon",
    archived: "Archivé",
  };
  return labels[status] ?? status;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectsPage() {
  const supabase = await createSupabaseServer();

  const [{ data: stacks }, { data: categories }] = await Promise.all([
    supabase.from("stacks").select("id, name").order("name"),
    supabase.from("project_categories").select("id, name").order("name"),
  ]);

  // Récupère tous les projets avec la catégorie associée
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, category:project_categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <p className="p-5 text-sm text-red-400 sm:p-8">
        Erreur de chargement des projets.
      </p>
    );
  }

  // Compte par statut pour les stats en haut
  const total = projects.length;
  const published = projects.filter((p) => p.status === "published").length;
  const drafts = projects.filter((p) => p.status === "draft").length;

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

          <AddProjectModal
            stacks={stacks ?? []}
            categories={categories ?? []}
          />
        </div>

        {/* ── Stats rapides ── */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5  lg:gap-10 lg:mb-10 ">
          <Dashcard
            title="Total"
            count={total}
            description={"projets"}
            variant={"default"}
          />

          <Dashcard
            title="Publiés"
            count={published}
            description="visibles sur le portfolio"
            variant="vert"
          />

          <Dashcard
            title="Brouillons"
            count={drafts}
            description="non publiés"
            variant={"default"}
          />
        </div>

        {/* ── Barre filtres ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white/80 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#277861] focus:ring-2 focus:ring-[#277861]/15 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861]/40 sm:w-auto dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-200 dark:hover:bg-white/[0.08]">
            <ListFilter size={16} />
            Trier
          </button>
        </div>

        {/* ── Grille projets ── */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 py-20 text-center dark:border-white/[0.12] dark:bg-white/[0.025] sm:py-24">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
              <Folder size={26} />
            </div>
            <p className="mb-1 font-semibold">Aucun projet pour l'instant</p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              Créez votre premier projet pour le faire apparaître ici.
            </p>
            <Link
              href="/dayane/dashboard/projects/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus size={16} />
              Nouveau projet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#277861]/35 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-white/[0.08] dark:bg-[#191a1c] dark:hover:border-emerald-400/25 dark:hover:shadow-black/20"
              >
                {/* Image du projet — fallback gris si pas d'image */}
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

                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${statusStyle(project.status)}`}
                  >
                    {statusLabel(project.status)}
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
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-500">
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
