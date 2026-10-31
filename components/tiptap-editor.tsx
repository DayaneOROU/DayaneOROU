"use client"; // TipTap manipule le DOM → composant client

import { useEditor, EditorContent } from "@tiptap/react"; // hook + zone d'édition
import StarterKit from "@tiptap/starter-kit"; // gras, italique, titres, listes, citations, code
import Image from "@tiptap/extension-image"; // images via URL

type Props = {
  value: string; // HTML actuel
  onChange: (html: string) => void; // renvoie le HTML au parent
};

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Image], // modules activés
    content: value, // contenu initial
    immediatelyRender: false, // évite l'erreur d'hydratation SSR
    onUpdate: ({ editor }) => onChange(editor.getHTML()), // remonte le HTML à chaque frappe
    editorProps: {
      attributes: {
        // prose-lg = texte confortable à lire ; min-h = grande zone d'écriture
        // px-8 py-6 = marges intérieures de "feuille" ; focus:outline-none = pas de contour parasite
        class: "prose prose-lg prose-neutral max-w-none min-h-[460px] px-8 py-6 focus:outline-none",
      },
    },
  });

  if (!editor) return null; // pas encore monté au premier rendu

  // Insère une image depuis une URL (Supabase Storage)
  const addImage = () => {
    const url = window.prompt("URL de l'image");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  // Bouton compact : actif = fond orange clair + texte orange, inactif = gris discret
  const btn = (active: boolean) =>
    `rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
      active
        ? "bg-orange-100 text-orange-700"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    }`;

  // Petit séparateur vertical entre groupes de boutons
  const sep = <span className="mx-1 h-5 w-px bg-neutral-200" />;

  return (
    <div>
      {/* Barre d'outils collée en haut au scroll (sticky), flou léger derrière */}
      <div className="sticky top-28 z-10 flex flex-wrap items-center gap-1 border-y border-neutral-200 bg-white/90 px-4 py-2 backdrop-blur">
        <button type="button" className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>
        <button type="button" className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>
        {sep}
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        {sep}
        <button type="button" className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>Liste</button>
        <button type="button" className={btn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>Citation</button>
        <button type="button" className={btn(editor.isActive("codeBlock"))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>
        {sep}
        <button type="button" className={btn(false)} onClick={addImage}>Image</button>
      </div>

      <EditorContent editor={editor} /> {/* zone d'écriture */}
    </div>
  );
}