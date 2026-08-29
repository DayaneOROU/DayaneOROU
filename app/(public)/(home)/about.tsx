// app/about/page.tsx (ou components/About.tsx)

import { Mail, MapPin, Globe, Award, Sparkles, Coffee } from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} />
          Bienvenue
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Je suis <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Léa Martin</span>
        </h1>

        {/* Sous-titre */}
        <div className="border-l-4 border-indigo-600 pl-4 mt-3">
          <p className="text-lg md:text-xl text-slate-700 font-light">
            Graphiste & designer UI — je donne vie aux identités visuelles
          </p>
        </div>

        {/* Grille 2 colonnes */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">

          {/* Colonne gauche */}
          <div className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Depuis 6 ans</strong>, j&apos;accompagne des marques 
              cosmétiques et des startups tech dans la création 
              d&apos;univers visuels cohérents et mémorables.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Mon approche ? Allier <strong className="text-slate-900">créativité</strong> et 
              <strong className="text-slate-900"> stratégie</strong>. Chaque couleur, chaque 
              espace, chaque typographie est pensée pour raconter 
              une histoire et créer une connexion émotionnelle avec 
              votre audience.
            </p>
          </div>

          {/* Colonne droite */}
          <div>
            <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-indigo-600">✦</span> Ce qui compte pour moi
            </p>
            <ul className="space-y-2.5 text-slate-700">
              {['Authenticité avant tout', 'Design simple et intemporel', 'Écoute et collaboration', 'Livraison dans les délais'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Fierté */}
            <div className="mt-5 bg-slate-50 rounded-xl p-3 flex items-start gap-3">
              <Award size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Petite fierté :</span> j&apos;ai participé au rebranding de 
                <strong className="text-slate-800"> 3 marques</strong> primées au French Design Award.
              </p>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <hr className="my-8 border-slate-200" />

        {/* Footer infos */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-indigo-500" />
              Lyon, France
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5">
              <Globe size={16} className="text-indigo-500" />
              🇫🇷 🇬🇧
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1.5">
              <Coffee size={16} className="text-indigo-500" />
              Disponible
            </span>
          </div>

          <a
            href="#contact"
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Me contacter
          </a>
        </div>

        {/* Passion cachée */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex items-center gap-2 text-xs text-slate-400">
          <span>⚡</span>
          Quand je ne suis pas sur Figma, je suis en train de tester de nouvelles recettes de pâtisserie.
        </div>

      </div>
    </main>
  );
}