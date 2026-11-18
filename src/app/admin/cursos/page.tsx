"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllCourses } from "@/services/courseServices";
import { useAdmin } from "@/components/admin/AdminProvider";
import type { Course } from "@/types/course";

export default function AdminCursosPage() {
  const { openCourseEditor, revision } = useAdmin();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAllCourses()
      .then((data) => {
        if (!cancelled) {
          setCourses(data);
          setError("");
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar cursos:", err);
        if (!cancelled) setError("Não foi possível carregar os cursos. Confira as regras do Firestore.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [revision]);

  if (loading) return <p className="p-10 text-center">Carregando cursos…</p>;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[#0f2a44]">Gerenciar Cursos</h1>
        <button type="button" className="admin-button" onClick={() => openCourseEditor()}>
          + Novo curso
        </button>
      </div>

      {error && <p className="editor-error mb-4">{error}</p>}

      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-wrap items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-24 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {course.image && <Image src={course.image} alt="" fill sizes="96px" className="object-cover" />}
            </div>

            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{course.shortDescription}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                <span>/cursos/{course.slug}</span>
                {course.featured && <span className="text-yellow-700 font-bold">• Carrossel</span>}
                {!course.published && <span className="text-red-600 font-bold">• Rascunho</span>}
                {course.enrollmentUrl && <span className="truncate max-w-[280px]">• Link: {course.enrollmentUrl}</span>}
              </div>
            </div>

            <div className="flex gap-2">
              {course.published && (
                <Link href={`/cursos/${course.slug}`} className="admin-button admin-button-light">
                  Ver
                </Link>
              )}
              <button type="button" className="admin-button" onClick={() => openCourseEditor(course)}>
                Editar
              </button>
            </div>
          </div>
        ))}

        {!error && courses.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Nenhum curso cadastrado. Crie um novo ou importe os exemplos pela Home.
          </p>
        )}
      </div>
    </div>
  );
}
