"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Underline, Undo2 } from "lucide-react";
import { ARTICLE_BODY } from "@/lib/articleStyles";

interface Props {
  /** HTML the editor starts with. Later changes to this prop are ignored. */
  initialHtml: string;
  /** Called with the current HTML, or "" when the editor is empty. */
  onChange: (html: string) => void;
}

// A visual editor for the article body. It reads and writes the same HTML the site stores.
export default function RichTextEditor({ initialHtml, onChange }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false, // this page is rendered on the server first
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        link: { openOnClick: false, autolink: true, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
      }),
    ],
    content: initialHtml,
    editorProps: {
      // the important flag beats the global keyboard-focus outline, which would frame the whole text
      attributes: { class: `${ARTICLE_BODY} min-h-[24rem] outline-none!`, "aria-label": "Κείμενο άρθρου" },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            quote: editor.isActive("blockquote"),
            bullets: editor.isActive("bulletList"),
            numbers: editor.isActive("orderedList"),
            link: editor.isActive("link"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  });

  function openLink() {
    if (!editor) return;
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "https://");
    setLinkOpen(true);
  }

  function applyLink() {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url || url === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkOpen(false);
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
  }

  const chain = () => editor!.chain().focus();
  const tools = [
    { label: "Έντονα", icon: Bold, on: active?.bold, run: () => chain().toggleBold().run() },
    { label: "Πλάγια", icon: Italic, on: active?.italic, run: () => chain().toggleItalic().run() },
    { label: "Υπογράμμιση", icon: Underline, on: active?.underline, run: () => chain().toggleUnderline().run() },
    null,
    { label: "Επικεφαλίδα", icon: Heading2, on: active?.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
    { label: "Υποεπικεφαλίδα", icon: Heading3, on: active?.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
    { label: "Παράθεμα", icon: Quote, on: active?.quote, run: () => chain().toggleBlockquote().run() },
    null,
    { label: "Λίστα με κουκκίδες", icon: List, on: active?.bullets, run: () => chain().toggleBulletList().run() },
    { label: "Αριθμημένη λίστα", icon: ListOrdered, on: active?.numbers, run: () => chain().toggleOrderedList().run() },
    { label: "Διαχωριστική γραμμή", icon: Minus, on: false, run: () => chain().setHorizontalRule().run() },
    { label: "Σύνδεσμος", icon: Link2, on: active?.link || linkOpen, run: openLink },
    null,
    { label: "Αναίρεση", icon: Undo2, on: false, disabled: !active?.canUndo, run: () => chain().undo().run() },
    { label: "Επανάληψη", icon: Redo2, on: false, disabled: !active?.canRedo, run: () => chain().redo().run() },
  ];

  return (
    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000]">
      {/* stays below the site navbar while the text scrolls */}
      <div className="sticky top-16 md:top-20 xl:top-24 z-10 bg-black">
        <div className="flex flex-wrap items-center gap-1 px-2 py-2" role="toolbar" aria-label="Μορφοποίηση">
          {tools.map((tool, i) =>
            tool === null ? (
              <span key={i} className="w-px h-6 bg-white/25 mx-1" aria-hidden="true" />
            ) : (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={!!tool.on}
                disabled={!editor || tool.disabled}
                onClick={tool.run}
                className={`p-2 transition-colors duration-150 disabled:opacity-35 ${
                  tool.on ? "bg-[#F2AA48] text-black" : "text-[#F2AA48] hover:bg-white/15"
                }`}
              >
                <tool.icon className="w-4 h-4" />
              </button>
            )
          )}
        </div>

        {linkOpen && (
          <div className="flex flex-wrap items-center gap-2 px-2 pb-2">
            <input
              autoFocus
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); applyLink(); }
                if (e.key === "Escape") setLinkOpen(false);
              }}
              placeholder="https://..."
              aria-label="Διεύθυνση συνδέσμου"
              className="flex-1 min-w-48 px-3 py-1.5 text-sm bg-white text-black border-2 border-[#F2AA48]"
            />
            <button type="button" onClick={applyLink} className="px-3 py-1.5 text-sm font-semibold bg-[#F2AA48] text-black">
              Εφαρμογή
            </button>
            {active?.link && (
              <button type="button" onClick={removeLink} className="px-3 py-1.5 text-sm font-semibold text-white underline">
                Αφαίρεση
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-8 md:px-12 md:py-10">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
