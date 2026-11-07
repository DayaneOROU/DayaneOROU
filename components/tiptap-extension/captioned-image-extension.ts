// AJOUTÉ : tout le fichier. Le nœud « Image avec légende » : une image posée, penchée, avec une légende manuscrite.
import { Node } from "@tiptap/core"; // classe de base pour fabriquer un nœud

export const CaptionedImage = Node.create({
  name: "captionedImage", // identifiant interne (utilisé par le menu)
  group: "block", // un bloc, comme un paragraphe
  atom: true, // atome : on ne tape pas dedans, le bloc se manipule d'un seul tenant
  draggable: true, // déplaçable par glisser-déposer
  selectable: true, // un clic le sélectionne (puis Suppr)
  priority: 1000, // passe AVANT l'extension Image : sinon elle pourrait avaler l'<img> interne

  // Les 4 informations mémorisées par le nœud
  addAttributes() {
    return {
      src: { default: null }, // URL de l'image
      alt: { default: "" }, // texte alternatif
      caption: { default: "" }, // la légende manuscrite
      tilt: { default: "left" }, // inclinaison : "left" ou "right"
    };
  },

  // LECTURE : retrouver le nœud dans du HTML enregistré (doit reconnaître ce que renderHTML produit)
  parseHTML() {
    return [
      {
        tag: "figure.captioned-image", // notre conteneur
        getAttrs: (el) => {
          const element = el as HTMLElement; // précise le type (TipTap peut passer un string)
          const img = element.querySelector("img"); // l'image à l'intérieur
          const cap = element.querySelector("figcaption"); // la légende
          return {
            src: img?.getAttribute("src") ?? null, // l'URL de l'image
            alt: img?.getAttribute("alt") ?? "", // son texte alternatif
            caption: cap?.textContent ?? "", // la légende
            // tout ce qui n'est pas "right" devient "left"
            tilt: element.getAttribute("data-tilt") === "right" ? "right" : "left",
          };
        },
      },
    ];
  },

  // ÉCRITURE : le HTML produit. Le figcaption est toujours écrit (même vide) pour que lecture et écriture restent symétriques.
  renderHTML({ node }) {
    const { src, alt, caption, tilt } = node.attrs;
    return [
      "figure",
      { class: "captioned-image", "data-tilt": tilt }, // conteneur + inclinaison
      ["img", { src, alt }], // l'image
      ["figcaption", {}, caption || ""], // la légende (le CSS cache un figcaption vide)
    ];
  },
});