// AJOUTÉ : tout le fichier. Le nœud « Note en marge » : un bloc dans lequel ON PEUT TAPER (contrairement à la Capture).
import { Node } from "@tiptap/core"; // classe de base pour fabriquer un nœud

export const MarginNote = Node.create({
  name: "marginNote", // identifiant interne, utilisé par le menu (toggleNode)
  group: "block", // un bloc, comme un paragraphe
  content: "inline*", // contient du texte et des marques (gras, italique…) : c'est ce qui le rend éditable
  priority: 1000, // passe avant les autres extensions pour que notre touche Entrée soit lue en premier

  // LECTURE : retrouver une note dans du HTML déjà enregistré (doit reconnaître ce que renderHTML produit)
  parseHTML() {
    return [{ tag: "div.margin-note" }]; // le contrat de journal.css : <div class="margin-note">
  },

  // ÉCRITURE : le HTML produit. Le « 0 » est le trou où TipTap place le texte de la note
  renderHTML() {
    return ["div", { class: "margin-note" }, 0];
  },

  // AJOUTÉ : Entrée dans une note = on en sort vers un nouveau paragraphe juste dessous
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { $from } = editor.state.selection; // position du curseur
        if ($from.parent.type.name !== this.name) return false; // pas dans une note : comportement normal
        const after = $from.after(); // position juste après le bloc note
        return editor
          .chain()
          .insertContentAt(after, { type: "paragraph" }) // crée le paragraphe sous la note
          .focus(after + 1) // place le curseur dedans
          .run();
      },
    };
  },
});