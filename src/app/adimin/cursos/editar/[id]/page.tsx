// app/admin/cursos/editar/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addCourse, updateCourse } from "@/services/courseServices";
import type { Course } from "@/types/course";

export default function EditarCursoPage() {
  const router = useRouter();
  const params = useParams();
  
  // Se o id for "novo", não é edição
  const isEditing = params.id !== "novo" && !!params.id;

  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    image: "",
    enrollmentUrl: "",
    featured: false,
    published: true,
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    let active = true;
    const docRef = doc(db, "courses", params.id as string);
    getDoc(docRef)
      .then((snapshot) => {
        if (active && snapshot.exists()) {
          setFormData({ id: snapshot.id, ...snapshot.data() } as Course);
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o curso:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isEditing, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await updateCourse(params.id as string, formData);
      } else {
        await addCourse(formData as Omit<Course, "id">);
      }
      router.push("/admin/cursos");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o curso.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-10 text-center">Carregando dados...</p>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#0f2a44]">
        {isEditing ? "Editar Curso" : "Novo Curso"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-sm border">
        
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Título</span>
            <input 
              type="text" 
              value={formData.title || ""} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              className="border p-2 rounded" required 
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Slug (URL)</span>
            <input 
              type="text" 
              value={formData.slug || ""} 
              onChange={(e) => setFormData({...formData, slug: e.target.value})} 
              className="border p-2 rounded" required 
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Descrição Curta (Card)</span>
          <textarea 
            value={formData.shortDescription || ""} 
            onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} 
            className="border p-2 rounded h-20" required 
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Descrição Completa (Página do Curso)</span>
          <textarea 
            value={formData.description || ""} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            className="border p-2 rounded h-32" 
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">URL da Imagem</span>
            <input 
              type="text" 
              value={formData.image || ""} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
              className="border p-2 rounded" required 
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Link de Inscrição (Opcional)</span>
            <input 
              type="text" 
              value={formData.enrollmentUrl || ""} 
              onChange={(e) => setFormData({...formData, enrollmentUrl: e.target.value})} 
              className="border p-2 rounded" 
              placeholder="https://hotmart.com/..."
            />
          </label>
        </div>

        <div className="flex gap-6 mt-4 bg-gray-50 p-4 rounded border">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.featured || false} 
              onChange={(e) => setFormData({...formData, featured: e.target.checked})} 
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Destaque na Home</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.published || false} 
              onChange={(e) => setFormData({...formData, published: e.target.checked})} 
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Publicado</span>
          </label>
        </div>

        <div className="flex gap-4 mt-6 justify-end">
          {/* Cancelar como botão nativo HTML */}
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-6 py-2 rounded-lg font-bold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          
          {/* Salvar como botão nativo HTML */}
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#0f2a44] text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Curso"}
          </button>
        </div>
      </form>
    </div>
  );
}