// app/about/page.tsx (ou components/About.tsx)

import { Mail, MapPin, Globe, Award, Sparkles, Coffee } from "lucide-react";

export default function About() {
  return (
    <>
      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white py-15 px-6 md:px-25 ">
        <div>
          <h3 className="font-kalam font-bold text-6xl py-8">Me concernant</h3>
          <div className="text-2xl font-inter">
            <p>
              Je m'appelle <span>Dayane</span>, Etudiant Béninois en fin de
              cycle, curieux, et quelque part entre l'étudiant et le développeur
              que je suis en train de devenir — une ligne de code à la fois.{" "}
              <br />
            </p>{" "}
            <p>
              La tech n'est pas juste un métier pour moi — c'est une façon de
              penser, de résoudre, de laisser libre cours à mon imagination.
              Aujourd'hui, avec les avancées de l'IA, je vais plus vite, plus
              loin — comme un…
              <span>
                {" "}
                « Parfois, il faut savoir courir avant de savoir marcher. »{" "}
              </span>
            </p>
          </div>
        </div>
        <div></div>
      </main>
    </>
  );
}
