"use client";

import type { CatalogSource } from "@/lib/publicCourses";
import { useAdmin } from "./AdminProvider";

/** Barra exibida acima do carrossel somente para o admin. */
export function AdminCourseToolbar({ source }: { source: CatalogSource }) {
  const { isAdmin, openCourseEditor } = useAdmin();
  if (!isAdmin) return null;

  return (
    <div className="admin-toolbar">
      {/* Com exemplos na tela, o primeiro salvamento copia os exemplos para o Firestore. */}
      <button type="button" className="admin-button" onClick={() => openCourseEditor(undefined, { seedSamples: source !== "firestore" })}>
        + Novo curso
      </button>
      {source === "error" && (
        <span className="editor-error">
          Não foi possível ler os cursos do Firestore. Confira se o banco foi criado e as regras publicadas; até lá, as
          alterações não podem ser salvas.
        </span>
      )}
    </div>
  );
}
