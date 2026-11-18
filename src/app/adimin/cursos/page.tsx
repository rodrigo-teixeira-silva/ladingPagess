// app/admin/cursos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getCourses, deleteCourse } from "@/services/courseServices";
import type { Course } from "@/types/course";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCourses()
      .then((data) => {
        if (!cancelled) setCourses(data);
      })
      .catch((error) => {
        console.error("Erro ao carregar cursos:", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string, title: string) {
    const confirm = window.confirm(`Tem certeza que deseja excluir o curso "${title}"?`);
    if (!confirm) return;

    try {
      await deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
      alert("Curso excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir o curso.");
    }
  }

  if (loading) return <p className="p-10 text-center">Carregando cursos...</p>;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0f2a44]">Gerenciar Cursos</h1>
        <Link href="/admin/cursos/editar/novo">
          {/* Nota: Alterei para /editar/novo para reaproveitar o mesmo form */}
          <Button>+ Novo Curso</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-24 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image 
                src={course.image || "/assets/placeholder-course.jpg"} 
                alt={course.title} 
                fill 
                className="object-cover" 
              />
            </div>

            <div className="flex-grow">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{course.shortDescription}</p>
              <div className="flex gap-2 text-xs text-gray-400 mt-1">
                <span>Slug: {course.slug}</span>
                {course.featured && <span className="text-yellow-600 font-bold">• Destaque</span>}
                {!course.published && <span className="text-red-500 font-bold">• Rascunho</span>}
              </div>
            </div>

            <div className="flex gap-2">
            <Link href={`/admin/cursos/editar/${course.id}`}>
  <Button secondary>Editar</Button>
</Link>
              <button 
                onClick={() => handleDelete(course.id, course.title)}
                className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <p className="text-center text-gray-500 py-10">Nenhum curso cadastrado.</p>
        )}
      </div>
    </div>
  );
}