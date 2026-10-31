"use client"; // Hooks et événements : composant client obligatoire

import { useEffect, useRef, useState, useTransition } from "react";
import { createProject } from "@/lib/actions/projects";
import { Plus } from "lucide-react";

// Types minimaux des données reçues de la page serveur
type Option = { id: string; name: string };

type Props = {
  stacks: Option[]; // Liste des stacks disponibles
  categories: Option[]; // Liste des catégories disponibles
  onCreated?: () => void;
};

export default function AddProjectModal({ stacks, categories, onCreated }: Props) {
  const [open, setOpen] = useState(false); // Modal ouvert / fermé
  const [error, setError] = useState<string | null>(null); // Erreur renvoyée par le serveur
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]); // Ids des stacks cochées
  const [pending, startTransition] = useTransition(); // Indique l'envoi en cours
  const formRef = useRef<HTMLFormElement>(null); // Pour réinitialiser le formulaire

  // Fermeture avec Échap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // Nettoyage
  }, [open]);

  // Ajoute ou retire une stack de la sélection
  function toggleStack(id: string) {
    setSelectedStacks((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Bloque le rechargement natif
    const fd = new FormData(e.currentTarget); // Lecture des champs
    setError(null);

    const input = {
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      image_url: String(fd.get("image_url") ?? "").trim() || null,
      project_url: String(fd.get("project_url") ?? "").trim() || null,
      category_id: String(fd.get("category_id") ?? "") || null,
      published: fd.get("published") === "on",
    };

    startTransition(async () => {
      const res = await createProject(input, selectedStacks); // Appel de la Server Action
      if (res?.error) {
        setError(res.error);
        return;
      }
      formRef.current?.reset(); // Vide le formulaire
      setSelectedStacks([]); // Vide la sélection de stacks
      onCreated?.();
      setOpen(false);
    });
  }


  // Style commun des champs (palette du portfolio)
  const field =
    "w-full rounded-lg border border-gray-400 px-3 py-2 text-gray-900 outline-none focus:border-gray-900";

  return (
    <>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(true)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#277861] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#277861]/15 transition-all hover:-translate-y-0.5 hover:bg-[#1f624f] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#277861] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ef] sm:w-auto sm:px-5 dark:focus-visible:ring-offset-[#101112]"
      >
            <Plus size={18} strokeWidth={2.2} />
            Nouveau projet
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)} // Clic sur le fond = fermeture
        >
          <div
            className="max-h-[90wh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#918981]/30 bg-gray-100 dark:bg-[#0a0a0a] p-6"
            onClick={(e) => e.stopPropagation()} // Pas de fermeture au clic dans le modal
          >
            <h2 className="mb-4 text-xl font-semibold dark:text-[#E8DCC8]">
              Nouveau projet
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <input
                name="title"
                placeholder="Titre *"
                required
                className={field}
              />
              <textarea
                name="description"
                placeholder="Description"
                rows={4}
                className={field}
              />
              <input
                name="image_url"
                placeholder="URL de l'image (Supabase Storage)"
                className={field}
              />
              <input
                name="project_url"
                placeholder="URL du projet"
                className={field}
              />

              {/* Catégorie : relation many-to-one */}
              <select name="category_id" defaultValue="" className={field}>
                <option value="">— Catégorie —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Stacks : relation many-to-many, sélection par pastilles */}
              <div>
                <p className="mb-2 text-sm text-gray-900 dark:text-[#D0CDC9]">Stacks</p>
                <div className="flex flex-wrap gap-2">
                  {stacks.map((s) => {
                    const active = selectedStacks.includes(s.id); // Pastille sélectionnée ?
                    return (
                      <button
                        type="button" // Évite de soumettre le formulaire
                        key={s.id}
                        onClick={() => toggleStack(s.id)}
                        className={`rounded-full border px-3 py-1 text-sm transition ${
                          active
                            ? "border-[#E8DCC8] bg-[#E8DCC8] text-[#1A1A1A]"
                            : "border-[#918981]/40 text-[#D0CDC9] hover:border-[#E8DCC8]"
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-[#D0CDC9]">
                <input type="checkbox" name="published" /> Publier immédiatement
              </label>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-gray-900 dark:text-[#D0CDC9] hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={pending} // Anti double-clic
                  className="rounded-lg bg-[#e7c589] px-4 py-2 font-medium cursor-pointer text-[#1A1A1A] disabled:opacity-50"
                >
                  {pending ? "Enregistrement…" : "Valider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
