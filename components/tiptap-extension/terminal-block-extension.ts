// AJOUTÉ : tout le fichier. Le nœud « Bloc terminal » : une fenêtre sombre où l'on tape des commandes.
import { Node } from "@tiptap/core"; // classe de base pour fabriquer un nœud

export const TerminalBlock = Node.create({
  name: "terminalBlock", // identifiant interne (utilisé par le menu)
  group: "block", // un bloc, comme un paragraphe
  content: "text*", // du texte brut éditable à l'intérieur
  marks: "", // aucune marque (gras, italique…) dans un terminal
  code: true, // « mode code » : Entrée = retour à la ligne (pas de nouveau bloc), espaces conservés
  defining: true, // le bloc garde son type quand on colle du texte dedans

  // LECTURE : retrouver le terminal dans du HTML enregistré (doit reconnaître ce que renderHTML produit)
  parseHTML() {
    return [
      {
        tag: "div.terminal", // notre conteneur
        preserveWhitespace: "full", // conserve les espaces et les retours à la ligne
        contentElement: "pre code", // le texte à relire est celui du <code>, pas celui de la barre
      },
    ];
  },

  // ÉCRITURE : le HTML produit. Le « 0 » est le trou où TipTap place le texte saisi.
  renderHTML() {
    return [
      "div",
      { class: "terminal" }, // conteneur
      [
        "div",
        { class: "t-bar" }, // barre du haut
        ["span", { class: "t-dot" }], // pastille rouge (couleur gérée par le CSS)
        ["span", { class: "t-dot" }], // pastille jaune
        ["span", { class: "t-dot" }], // pastille verte
      ],
      ["pre", {}, ["code", {}, 0]], // le texte des commandes
    ];
  },

  // AJOUTÉ : Ctrl/Cmd + Entrée = sortir du terminal vers un paragraphe juste dessous
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": ({ editor }) => {
        // on n'intervient que si le curseur est dans un terminal
        if (editor.state.selection.$from.parent.type.name !== this.name) return false;
        return editor.commands.exitCode(); // crée le paragraphe de sortie et y place le curseur
      },
    };
  },
});