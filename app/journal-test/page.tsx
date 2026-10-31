import { Archivo_Black, Caveat, DM_Sans } from "next/font/google"; // polices chargées par Next (pas de lien externe)
import "@/styles/journal.css"; // notre feuille de style

// Chaque police expose une variable CSS que journal.css utilise
const title = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-title" });
const hand = Caveat({ subsets: ["latin"], weight: "600", variable: "--font-hand" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

// Article d'essai écrit « à la main » : c'est exactement le HTML que TipTap produira plus tard
const html = `
  <h2>Le contexte</h2>
  <div class="margin-note">Bénin Discover est devenu Bénin Travel quand le logo est arrivé.</div>
  <p>On m'a confié une plateforme pour une agence de tourisme. Pas une marketplace : la <mark>vitrine d'une seule agence</mark>, avec ses lieux et ses guides.</p>

  <div class="browser-shot" data-tilt="left">
    <div class="frame">
      <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><div class="url">localhost:3000</div></div>
      <img src="https://placehold.co/1200x600/064E3B/F5F0E8?text=Capture" alt="Capture de test" />
    </div>
    <div class="sticker" data-sticker="4" data-corner="br" style="--w:120px"></div>
  </div>

  <h2>Ce qui a cassé</h2>
  <ol>
    <li><p>XAMPP a corrompu mes données.</p></li>
    <li><p>L'erreur 150 sur les clés étrangères.</p></li>
  </ol>
`;

export default function JournalTest() {
  return (
    // les 3 classes .variable injectent les variables de police sur le conteneur
    <main className={`${title.variable} ${hand.variable} ${body.variable}`} style={{ background: "#F8F4EA", padding: "72px 24px" }}>
      {/* dangerouslySetInnerHTML : on injecte du HTML brut, comme on le fera avec blogs.content */}
      <div className="journal" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}