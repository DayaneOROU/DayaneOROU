"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// MODIFIÉ : on ajoute useCurrentEditor (lire l'éditeur depuis le contexte) et useEditorState
// (se re-rendre quand la sélection change) pour notre bouton de surlignage maison
import {
  EditorContent,
  EditorContext,
  useCurrentEditor,
  useEditor,
  useEditorState,
} from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
// RETIRÉ : import { Typography } ... (la typographie automatique remplaçait « ... » et « -> » sans prévenir)
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { FindAndReplace } from "@tiptap/extension-find-and-replace";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
// RETIRÉ : les imports de ColorHighlightPopover, ColorHighlightPopoverContent et
// ColorHighlightPopoverButton (menu de choix de couleurs : la couleur viendra du thème)
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import {
  SearchAndReplace,
  SearchAndReplaceButton,
} from "@/components/tiptap-ui/search-and-replace";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

// RETIRÉ : import content from ".../data/content.json" (le texte de démonstration)

// AJOUTÉ : le nœud Capture, son style dans l'éditeur, et le menu « + Insérer »
import { BrowserShot } from "@/components/tiptap-extension/browser-shot-extension";
import "@/components/tiptap-node/browser-shot-node/browser-shot-node.scss";
import { InsertDropdownMenu } from "@/components/tiptap-ui/insert-dropdown-menu/insert-dropdown-menu";

// AJOUTÉ : la Note en marge, son style éditeur, et le séparateur dessiné
// (l'import du séparateur reste APRÈS horizontal-rule-node.scss du template, sinon l'ancien trait gagne)
import { MarginNote } from "@/components/tiptap-extension/margin-note-extension";
import "@/components/tiptap-node/margin-note-node/margin-note-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-wave.scss";

// AJOUTÉ : l'Image avec légende et les Boutons de projet (extensions + styles éditeur)
import { CaptionedImage } from "@/components/tiptap-extension/captioned-image-extension";
import "@/components/tiptap-node/captioned-image-node/captioned-image-node.scss";
import { ProjectLinks } from "@/components/tiptap-extension/project-links-extension";
import "@/components/tiptap-node/project-links-node/project-links-node.scss";

// AJOUTÉ : le Tableau (extension officielle) et le Bloc terminal (extension + styles éditeur)
import { TableKit } from "@tiptap/extension-table";
import "@/components/tiptap-node/table-node/table-node.scss";
import { TerminalBlock } from "@/components/tiptap-extension/terminal-block-extension";
import "@/components/tiptap-node/terminal-block-node/terminal-block-node.scss";

const SEARCH_AND_REPLACE_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  block: "center",
};

// AJOUTÉ : bouton « Surligner » à une seule couleur.
// Il applique une balise <mark> SANS couleur : c'est notre CSS (variable --j-mark du thème) qui la peindra.
const HighlightToggleButton = () => {
  const { editor } = useCurrentEditor(); // l'éditeur fourni par EditorContext.Provider plus bas

  // Vrai quand le curseur est dans un texte surligné ; se met à jour à chaque changement de sélection
  const isActive = useEditorState({
    editor,
    selector: (ctx) => Boolean(ctx.editor?.isActive("highlight")),
  });

  if (!editor) return null; // l'éditeur n'est pas encore prêt au premier rendu

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"} // le style « enfoncé » du template
      aria-label="Surligner"
      aria-pressed={Boolean(isActive)}
      title="Surligner"
      onMouseDown={(e) => e.preventDefault()} // garde la sélection du texte quand on clique
      onClick={() => editor.chain().focus().toggleHighlight().run()} // pose ou retire le <mark>
    >
      <HighlighterIcon className="tiptap-button-icon" />
    </Button>
  );
};

const MainToolbarContent = ({
  // RETIRÉ : onHighlighterClick (la vue mobile « surligneur » n'existe plus)
  onLinkClick,
  onSearchAndReplaceClick,
  isSearchAndReplaceOpen,
  searchAndReplaceButtonRef,
  isMobile,
}: {
  onLinkClick: () => void;
  onSearchAndReplaceClick: () => void;
  isSearchAndReplaceOpen: boolean;
  searchAndReplaceButtonRef: React.RefObject<HTMLButtonElement | null>;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        {/* MODIFIÉ : niveaux [1,2,3,4] -> [2,3,4] : le H1 est déjà le titre de la page */}
        <HeadingDropdownMenu modal={false} levels={[2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {/* MODIFIÉ : un seul bouton de surlignage, identique sur bureau et mobile
            (avant : popover de couleurs sur bureau, vue spéciale sur mobile) */}
        <HighlightToggleButton />
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
        {/* AJOUTÉ : menu « + Insérer » (Capture pour l'instant) */}
        <InsertDropdownMenu modal={false} />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <SearchAndReplaceButton
          ref={searchAndReplaceButtonRef}
          aria-expanded={isSearchAndReplaceOpen}
          data-active-state={isSearchAndReplaceOpen ? "on" : "off"}
          onClick={onSearchAndReplaceClick}
        />
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

// MODIFIÉ : il ne reste qu'une vue mobile (le lien), donc plus de prop "type"
const MobileToolbarContent = ({ onBack }: { onBack: () => void }) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        <LinkIcon className="tiptap-button-icon" />
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    <LinkContent />
  </>
);

type SimpleEditorProps = {
  value?: string; // HTML initial (lu une seule fois, au montage)
  onChange?: (html: string) => void; // appelé à chaque modification
};

export function SimpleEditor({ value = "", onChange }: SimpleEditorProps) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  // MODIFIÉ : "highlighter" retiré des vues possibles
  const [mobileView, setMobileView] = useState<"main" | "link">("main");
  const [isSearchAndReplaceOpen, setIsSearchAndReplaceOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const searchAndReplaceButtonRef = useRef<HTMLButtonElement>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      // MODIFIÉ : multicolor true -> false. Le <mark> n'embarque plus de couleur en dur :
      // elle vient du thème de l'article
      Highlight.configure({ multicolor: false }),
      BrowserShot,
      MarginNote,
      CaptionedImage, // AJOUTÉ : l'Image avec légende (priorité haute, donc avant Image)
      ProjectLinks, // AJOUTÉ : les Boutons code / démo
      TableKit.configure({ table: { resizable: false } }),
      TerminalBlock, // AJOUTÉ : le Bloc terminal
      Image,
      // RETIRÉ : Typography
      Superscript,
      Subscript,
      Selection,
      FindAndReplace.configure({
        searchDebounceMs: 500,
        injectCSS: false,
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload, // inchangé : c'est encore le code de démo (remplacé à l'étape 8)
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    // MODIFIÉ : contenu de départ reçu en prop (vide à la création)
    content: value,
    // AJOUTÉ : à chaque modification, on renvoie le HTML au formulaire
    onUpdate: ({ editor }) => onChangeRef.current?.(editor.getHTML()),
  });

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const openSearchAndReplace = useCallback(() => {
    setMobileView("main");
    setIsSearchAndReplaceOpen(true);
  }, []);

  const closeSearchAndReplace = useCallback(() => {
    setIsSearchAndReplaceOpen(false);
    searchAndReplaceButtonRef.current?.focus();
  }, []);

  const toggleSearchAndReplace = useCallback(() => {
    if (isSearchAndReplaceOpen) {
      closeSearchAndReplace();
      return;
    }

    openSearchAndReplace();
  }, [closeSearchAndReplace, isSearchAndReplaceOpen, openSearchAndReplace]);

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              // RETIRÉ : onHighlighterClick
              onLinkClick={() => setMobileView("link")}
              onSearchAndReplaceClick={toggleSearchAndReplace}
              isSearchAndReplaceOpen={isSearchAndReplaceOpen}
              searchAndReplaceButtonRef={searchAndReplaceButtonRef}
              isMobile={isMobile}
            />
          ) : (
            // MODIFIÉ : plus de prop "type"
            <MobileToolbarContent onBack={() => setMobileView("main")} />
          )}
        </Toolbar>

        <SearchAndReplace
          className="simple-editor-search-and-replace"
          open={isSearchAndReplaceOpen}
          onOpen={openSearchAndReplace}
          onClose={closeSearchAndReplace}
          scrollIntoViewOptions={SEARCH_AND_REPLACE_SCROLL_OPTIONS}
        />

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
