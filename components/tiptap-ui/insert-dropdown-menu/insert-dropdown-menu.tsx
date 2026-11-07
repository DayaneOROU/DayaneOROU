"use client"

// MODIFIÉ : le menu « + Insérer » gère maintenant le Tableau (+ 5 actions) et le Bloc terminal en plus des 5 blocs précédents.
import { forwardRef, useCallback, useState } from "react"
import type { Editor } from "@tiptap/react"

// --- Icônes et hooks ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Primitives d'interface ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/tiptap-ui-primitive/dropdown-menu"

import "@tiptap/extension-table" // AJOUTÉ : charge les types des commandes de tableau (insertTable, addRowAfter…)

// Une seule règle de sécurité pour toutes les URL saisies : http(s) ou chemin du site.
// Refuse « javascript: » et consorts.
const isSafeUrl = (value: string) => /^(https?:\/\/|\/)/i.test(value)

export interface InsertDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null // éditeur optionnel : sinon celui du contexte
  modal?: boolean // menu modal ou non
}

export const InsertDropdownMenu = forwardRef<
  HTMLButtonElement,
  InsertDropdownMenuProps
>(({ editor: providedEditor, modal = true, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor) // l'éditeur actif
  const [isOpen, setIsOpen] = useState<boolean>(false) // menu ouvert ou fermé

  // INCHANGÉ : insère une Capture (demande l'image puis l'adresse)
  const insertBrowserShot = useCallback(() => {
    if (!editor) return

    const src = window.prompt("URL de l'image (https://...) :")?.trim()
    if (!src) return

    if (!isSafeUrl(src)) {
      window.alert("URL refusée : elle doit commencer par https:// ou /")
      return
    }

    const url =
      window.prompt("Adresse affichée dans la barre (facultatif) :", "")?.trim() ?? ""

    editor
      .chain()
      .focus()
      .insertContent([
        { type: "browserShot", attrs: { src, alt: "Capture d'écran", url, tilt: "left" } },
        { type: "paragraph" }, // paragraphe vide derrière, pour continuer à écrire
      ])
      .run()
  }, [editor])

  // INCHANGÉ : insère une Image avec légende (demande l'URL puis la légende)
  const insertCaptionedImage = useCallback(() => {
    if (!editor) return

    const src = window.prompt("URL de l'image (https://...) :")?.trim()
    if (!src) return

    if (!isSafeUrl(src)) {
      window.alert("URL refusée : elle doit commencer par https:// ou /")
      return
    }

    const caption = window.prompt("Légende manuscrite (facultatif) :", "")?.trim() ?? ""

    editor
      .chain()
      .focus()
      .insertContent([
        { type: "captionedImage", attrs: { src, alt: caption || "Image", caption, tilt: "left" } },
        { type: "paragraph" },
      ])
      .run()
  }, [editor])

  // INCHANGÉ : insère les boutons « Voir le code » / « Voir la démo » (chaque URL est facultative)
  const insertProjectLinks = useCallback(() => {
    if (!editor) return

    // null = « Annuler » : on abandonne tout. Une chaîne vide = « pas de ce bouton ».
    const codeRaw = window.prompt("Lien « Voir le code » (laisser vide = pas de bouton) :", "")
    if (codeRaw === null) return
    const demoRaw = window.prompt("Lien « Voir la démo » (laisser vide = pas de bouton) :", "")
    if (demoRaw === null) return

    const codeUrl = codeRaw.trim()
    const demoUrl = demoRaw.trim()

    if (!codeUrl && !demoUrl) return // aucun lien : rien à insérer

    if ((codeUrl && !isSafeUrl(codeUrl)) || (demoUrl && !isSafeUrl(demoUrl))) {
      window.alert("URL refusée : elle doit commencer par https:// ou /")
      return
    }

    editor
      .chain()
      .focus()
      .insertContent([
        { type: "projectLinks", attrs: { codeUrl: codeUrl || null, demoUrl: demoUrl || null } },
        { type: "paragraph" },
      ])
      .run()
  }, [editor])

  // INCHANGÉ : transforme le paragraphe courant en note (et inversement si on y est déjà)
  const toggleMarginNote = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleNode("marginNote", "paragraph").run()
  }, [editor])

  // INCHANGÉ : insère le trait horizontal du template, que le CSS dessine en vague
  const insertSeparator = useCallback(() => {
    if (!editor) return
    editor.chain().focus().setHorizontalRule().run()
  }, [editor])

  // AJOUTÉ : insère un tableau de 3 lignes x 3 colonnes, la première ligne étant l'en-tête
  const insertTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  // AJOUTÉ : transforme le paragraphe courant en terminal (et inversement si on y est déjà)
  const toggleTerminal = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleNode("terminalBlock", "paragraph").run()
  }, [editor])

  if (!editor) return null // rien à afficher tant que l'éditeur n'est pas prêt

  // AJOUTÉ : les 5 actions de tableau. « can » dit si l'action est possible (curseur dans un tableau) :
  // sinon l'entrée est grisée. Provisoire, en attendant le popover d'édition.
  const tableActions = [
    {
      label: "Tableau : + ligne",
      can: () => editor.can().addRowAfter(),
      run: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: "Tableau : + colonne",
      can: () => editor.can().addColumnAfter(),
      run: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Tableau : − ligne",
      can: () => editor.can().deleteRow(),
      run: () => editor.chain().focus().deleteRow().run(),
    },
    {
      label: "Tableau : − colonne",
      can: () => editor.can().deleteColumn(),
      run: () => editor.chain().focus().deleteColumn().run(),
    },
    {
      label: "Tableau : supprimer",
      can: () => editor.can().deleteTable(),
      run: () => editor.chain().focus().deleteTable().run(),
    },
  ]

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Insérer un bloc"
          tooltip="Insérer un bloc"
          {...buttonProps}
          ref={ref}
        >
          <span className="tiptap-button-text">+ Insérer</span>
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={insertBrowserShot}>
              <span className="tiptap-button-text">Capture</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={insertCaptionedImage}>
              <span className="tiptap-button-text">Image avec légende</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={insertProjectLinks}>
              <span className="tiptap-button-text">Boutons code / démo</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={toggleMarginNote}>
              <span className="tiptap-button-text">Note en marge</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={insertSeparator}>
              <span className="tiptap-button-text">Séparateur</span>
            </Button>
          </DropdownMenuItem>
          {/* AJOUTÉ : Tableau */}
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={insertTable}>
              <span className="tiptap-button-text">Tableau</span>
            </Button>
          </DropdownMenuItem>
          {/* AJOUTÉ : Bloc terminal */}
          <DropdownMenuItem asChild>
            <Button type="button" variant="ghost" onClick={toggleTerminal}>
              <span className="tiptap-button-text">Bloc terminal</span>
            </Button>
          </DropdownMenuItem>
          {/* AJOUTÉ : actions de tableau (grisées hors d'un tableau) */}
          {tableActions.map((action) => (
            <DropdownMenuItem key={action.label} asChild>
              <Button
                type="button"
                variant="ghost"
                disabled={!action.can()}
                onClick={action.run}
              >
                <span className="tiptap-button-text">{action.label}</span>
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

InsertDropdownMenu.displayName = "InsertDropdownMenu"

export default InsertDropdownMenu