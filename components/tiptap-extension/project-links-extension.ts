// AJOUTÉ : tout le fichier. Le nœud « Boutons Voir le code / Voir la démo ».
import { Node } from "@tiptap/core"; // classe de base pour fabriquer un nœud

export const ProjectLinks = Node.create({
  name: "projectLinks", // identifiant interne (utilisé par le menu)
  group: "block", // un bloc
  atom: true, // atome : les deux liens se règlent à l'insertion
  draggable: true, // déplaçable
  selectable: true, // sélectionnable puis supprimable

  // Les 2 liens : chacun est facultatif (null = pas de bouton)
  addAttributes() {
    return {
      codeUrl: { default: null }, // lien du bouton « Voir le code »
      demoUrl: { default: null }, // lien du bouton « Voir la démo »
    };
  },

  // LECTURE : on retrouve les liens dans les <a> déjà enregistrés
  parseHTML() {
    return [
      {
        tag: "div.project-links", // notre conteneur
        getAttrs: (el) => {
          const element = el as HTMLElement;
          return {
            // chaque lien est lu sur son <a> ; s'il n'existe pas, on retombe sur null
            codeUrl: element.querySelector("a.btn-code")?.getAttribute("href") ?? null,
            demoUrl: element.querySelector("a.btn-demo")?.getAttribute("href") ?? null,
          };
        },
      },
    ];
  },

  // ÉCRITURE : un <a> par lien renseigné ; "" = aucun bouton (texte vide, sans effet)
  renderHTML({ node }) {
    const { codeUrl, demoUrl } = node.attrs;
    return [
      "div",
      { class: "project-links" },
      codeUrl
        ? ["a", { class: "btn btn-code", href: codeUrl, target: "_blank", rel: "noopener noreferrer" }, "Voir le code ↗"]
        : "",
      demoUrl
        ? ["a", { class: "btn btn-demo", href: demoUrl, target: "_blank", rel: "noopener noreferrer" }, "Voir la démo ↗"]
        : "",
    ];
  },
});