"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { PageId } from "@/data/pages";
import type { PageContent } from "@/lib/pageContent";
import { useAdmin } from "./AdminProvider";
import { PageEditorDialog } from "./PageEditorDialog";

/** Barra com o botão "Editar página", visível somente para o admin. */
export function AdminPageBar({
  pageId,
  content,
  label = "Editar página",
  className = "",
}: {
  pageId: PageId;
  content: PageContent;
  label?: string;
  className?: string;
}) {
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);
  if (!isAdmin) return null;

  return (
    <div className={`admin-toolbar ${className}`}>
      <button type="button" className="admin-button" onClick={() => setOpen(true)}>
        <Pencil size={15} aria-hidden="true" />
        {label}
      </button>
      {content.source === "error" && (
        <span className="editor-error">
          Não foi possível ler o conteúdo do Firestore; exibindo o texto padrão. As alterações não poderão ser salvas até
          o banco estar acessível.
        </span>
      )}
      {open && <PageEditorDialog pageId={pageId} values={content.values} onClose={() => setOpen(false)} />}
    </div>
  );
}
