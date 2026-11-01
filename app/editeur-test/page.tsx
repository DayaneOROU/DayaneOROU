// L'import ci-dessous est celui de la doc, mais deux pages de la doc donnent des chemins différents :
// après l'installation, ouvrez components/tiptap-templates/simple/ et corrigez le chemin si besoin
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function EditeurTest() {
  return <SimpleEditor />; // l'éditeur complet, rien d'autre
}