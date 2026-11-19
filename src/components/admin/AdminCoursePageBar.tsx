"use client";

import { Pencil } from "lucide-react";
import type { Course } from "@/types/course";
import { useAdmin } from "./AdminProvider";

/** Barra exibida no topo da página do curso, somente para o admin. */
export function AdminCoursePageBar({ course }: { course: Course }) {
  const { isAdmin, openCourseEditor } = useAdmin();
  if (!isAdmin) return null;

  return (
    <div className="admin-toolbar admin-course-bar">
      <button type="button" className="admin-button" onClick={() => openCourseEditor(course)}>
        <Pencil size={15} aria-hidden="true" />
        Editar curso
      </button>
      <span>Título, imagem, texto e link do botão “Quero me inscrever”.</span>
    </div>
  );
}
