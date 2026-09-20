// app/about/page.tsx (ou components/About.tsx)

import { Mail, MapPin, Globe, Award, Sparkles, Coffee } from "lucide-react";
import { TextReveal } from "@/components/ui/text-reveal"
export default function About() {
  return (
    <>
      <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white py-15 px-6 md:px-25 ">
        <div className="text-center">
          <h3 className="font-kalam font-bold  md:text-left text-6xl py-10 ">Me concernant</h3>
          <div className="text-2xl font-inter font-medium md:pr-5">
            
            <p>
              Je m'appelle <span>Dayane</span>, Etudiant Béninois en fin de
              cycle, et quelque part entre l'étudiant et le développeur
              que je suis en train de devenir
              <br /><br />
            </p>
            <p>
              La tech n'est pas juste un métier pour moi — c'est une façon de
              penser, de résoudre, de laisser libre cours à mon imagination.
              Aujourd'hui, avec les avancées de l'IA, je vais plus vite, plus
              loin comme un grang homme l'as dit 
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
