"use client";

import { Pencil } from "lucide-react";
import type { Course } from "@/types/course";
import { useAdmin } from "./AdminProvider";

/** Botão "Editar" visível apenas para o admin. */
export function EditCourseButton({ course, className = "" }: { course: Course; className?: string }) {
  const { isAdmin, openCourseEditor } = useAdmin();
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      className={`admin-button ${className}`}
      onClick={() => openCourseEditor(course)}
      aria-label={`Editar o curso ${course.title}`}
    >
      <Pencil size={15} aria-hidden="true" />
      Editar
    </button>
  );
}
