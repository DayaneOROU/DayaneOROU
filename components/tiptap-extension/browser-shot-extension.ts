// AJOUTÉ : tout le fichier. Le nœud « Capture » (fenêtre de navigateur autour d'une image).
import { Node } from "@tiptap/core"; // classe de base pour fabriquer un nœud personnalisé

export const BrowserShot = Node.create({
  name: "browserShot", // identifiant interne du nœud (utilisé par le menu pour l'insérer)
  group: "block", // c'est un bloc : il occupe toute la largeur, comme un paragraphe
  atom: true, // « atome » : TipTap le traite d'un seul bloc, on ne peut pas taper dedans
  draggable: true, // on peut le glisser-déposer pour le déplacer
  selectable: true, // un clic le sélectionne (puis Suppr pour l'enlever)
  priority: 1000, // passe AVANT l'extension Image : sinon elle pourrait avaler l'<img> interne

  // Les 4 informations mémorisées par le nœud (une par propriété de la capture)
  addAttributes() {
    return {
      src: { default: null }, // URL de l'image
      alt: { default: "" }, // texte alternatif de l'image
      url: { default: "" }, // adresse affichée dans la pastille de la barre
      tilt: { default: "left" }, // inclinaison : "left" ou "right" (data-tilt du CSS)
    };
  },

  // LECTURE : comment retrouver un nœud dans du HTML déjà enregistré.
  // Doit reconnaître EXACTEMENT ce que renderHTML produit, sinon la capture disparaît à la réouverture.
  parseHTML() {
    return [
      {
        tag: "div.browser-shot", // on cherche notre conteneur
        getAttrs: (el) => {
          const element = el as HTMLElement; // TipTap peut passer un string : on précise le type
          const img = element.querySelector("img"); // l'image à l'intérieur
          const url = element.querySelector(".url"); // la pastille d'adresse
          return {
            src: img?.getAttribute("src") ?? null, // on récupère l'URL de l'image
            alt: img?.getAttribute("alt") ?? "", // et son texte alternatif
            url: url?.textContent ?? "", // et l'adresse affichée
            // inclinaison lue sur data-tilt ; tout ce qui n'est pas "right" devient "left"
            tilt: element.getAttribute("data-tilt") === "right" ? "right" : "left",
          };
        },
      },
    ];
  },

  // ÉCRITURE : le HTML produit. Mêmes noms de classes que journal.css (le « contrat »).
  renderHTML({ node }) {
    const { src, alt, url, tilt } = node.attrs; // les attributs du nœud
    return [
      "div",
      { class: "browser-shot", "data-tilt": tilt }, // conteneur + inclinaison
      [
        "div",
        { class: "frame" }, // le cadre de la fenêtre
        [
          "div",
          { class: "bar" }, // barre du haut
          ["span", { class: "dot" }], // pastille rouge (couleur gérée par le CSS)
          ["span", { class: "dot" }], // pastille jaune
          ["span", { class: "dot" }], // pastille verte
          ["span", { class: "url" }, url || ""], // pastille d'adresse (vide si non renseignée)
        ],
        ["img", { src, alt }], // l'image de la capture
      ],
    ];
  },
});