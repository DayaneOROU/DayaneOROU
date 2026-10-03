// app/dayane/dashboard/blogs/page.tsx
import Dashcard from "@/components/dashcard";
import { getBlogs } from "@/lib/actions/blogs"; // votre action existante (renvoie blogs + projet lié)
import { Plus, ListFilter, ExternalLink, FileText, Search } from "lucide-react"; // icônes
import Link from "next/link"; // liens internes Next.js

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Formate "2026-09-15T..." → "sept. 2026"
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    month: "short", // mois abrégé
    year: "numeric", // année sur 4 chiffres
  });
}

// Le contenu est du HTML TipTap : on retire les balises pour fabriquer un extrait lisible
function excerpt(html: string | null) {
  if (!html) return ""; // pas de contenu → extrait vide
  return html
    .replace(/<[^>]*>/g, " ") // remplace chaque balise par un espace
    .replace(/&nbsp;/g, " ") // espaces insécables HTML → espace normal
    .replace(/\s+/g, " ") // réduit les espaces multiples à un seul
    .trim(); // enlève les espaces au début et à la fin
}

// Style du badge selon l'état de publication (booléen, pas de "status" sur blogs)
function badgeStyle(published: boolean) {
  return published
    ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300" // publié : vert
    : "border border-white/10 bg-white/[0.06] text-zinc-400"; // brouillon : gris
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogsPage() {
  // Récupère les articles ; getBlogs() lève une erreur en cas d'échec, on l'intercepte pour afficher un message
  let blogs: Awaited<ReturnType<typeof getBlogs>> = [];
  try {
    blogs = await getBlogs();
  } catch (error) {
    console.error(error); // trace côté serveur
    return (
      <p className="p-5 text-sm text-red-400 sm:p-8">
        Erreur de chargement des articles.
      </p>
    );
  }

  // Compteurs pour les stats en haut
  const total = blogs.length; // nombre total d'articles
  const published = blogs.filter((b) => b.published).length; // articles publiés
  const drafts = total - published; // le reste = brouillons

  return (
    <div className="admin-padding min-h-screen pb-16 text-zinc-900 dark:bg-[#101112] dark:text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* ── En-tête ── */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-inter text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-7xl">
              Blogs
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Rédigez et gérez les articles de votre portfolio.
            </p>
          </div>

          {/* Bouton vers le formulaire de création */}
          <Link
            href="/dayane/dashboard/blogs/new"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#277861] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#277861]/15 transition-all hover:-translate-y-0.5 hover:bg-[#1f624f] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ef] sm:w-auto sm:px-5 dark:focus-visible:ring-offset-[#101112]"
          >
            <Plus size={18} strokeWidth={2.2} />
            Nouvel article
          </Link>
        </div>

        {/* ── Stats rapides ── */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:gap-10 lg:mb-10">
          <Dashcard
            title="Total"
            count={total}
            description="articles"
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
              placeholder="Rechercher un article..."
              className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white/80 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#277861] focus:ring-2 focus:ring-[#277861]/15 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861]/40 sm:w-auto dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-200 dark:hover:bg-white/[0.08]">
            <ListFilter size={16} />
            Trier
          </button>
        </div>

        {/* ── Grille articles ── */}
        {blogs.length === 0 ? (
          // État vide : aucun article en base
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 py-20 text-center dark:border-white/[0.12] dark:bg-white/[0.025] sm:py-24">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#277861]/10 text-[#277861] dark:bg-emerald-400/10 dark:text-emerald-300">
              <FileText size={26} />
            </div>
            <p className="mb-1 font-semibold">Aucun article pour l'instant</p>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
              Rédigez votre premier article pour le faire apparaître ici.
            </p>
            <Link
              href="/dayane/dashboard/blogs/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus size={16} />
              Nouvel article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id} // clé React unique
                className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#277861]/35 hover:shadow-xl hover:shadow-zinc-900/5 dark:border-white/[0.08] dark:bg-[#191a1c] dark:hover:border-emerald-400/25 dark:hover:shadow-black/20"
              >
                {/* Couverture de l'article — fallback si cover_url est vide */}
                <div className="relative h-40 overflow-hidden bg-zinc-100 dark:bg-zinc-800 sm:h-44">
                  {blog.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.cover_url}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                      <FileText
                        size={30}
                        className="text-zinc-300 dark:text-zinc-700"
                      />
                    </div>
                  )}

                  {/* Badge Publié / Brouillon */}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${badgeStyle(blog.published)}`}
                  >
                    {blog.published ? "Publié" : "Brouillon"}
                  </span>
                </div>

                {/* Contenu de la carte */}
                <div className="p-4 sm:p-5">
                  {/* Projet lié (relation project_id, nullable) */}
                  {blog.project?.title && (
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#277861] dark:text-emerald-400">
                      {blog.project.title}
                    </p>
                  )}

                  <h2 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-zinc-900 dark:text-white">
                    {blog.title}
                  </h2>

                  {/* Extrait du contenu (HTML nettoyé) */}
                  <p className="mb-5 line-clamp-2 min-h-8 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {excerpt(blog.content)}
                  </p>

                  <div className="flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-white/[0.08]">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-500">
                      {formatDate(blog.created_at)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Lien vers l'article public, seulement s'il est publié */}
                      {blog.published && (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861] dark:hover:bg-white/[0.08] dark:hover:text-white"
                          title="Voir l'article"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}

                      {/* Lien vers la page d'édition */}
                      <Link
                        href={`/dayane/dashboard/blogs/${blog.id}`}
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
