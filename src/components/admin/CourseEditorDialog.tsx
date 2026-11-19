"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { compressImage } from "@/lib/imageCompression";
import { firestoreErrorMessage as errorMessage, withTimeout } from "@/lib/firestoreErrors";
import { validExternalUrl } from "@/lib/utils";
import { sampleCourses } from "@/data/courses";
import { createCourse, deleteCourse, ensureSampleCoursesImported, updateCourse } from "@/services/courseServices";
import type { CompressedImage, Course, CourseInput } from "@/types/course";

interface Props {
  course?: Course;
  /** O site está exibindo os exemplos locais: copia-os para o Firestore antes de gravar. */
  seedSamples: boolean;
  onClose: () => void;
  onChanged: () => void;
}

export function CourseEditorDialog({ course, seedSamples, onClose, onChanged }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEditing = Boolean(course);

  const [form, setForm] = useState<CourseInput>({
    title: course?.title ?? "",
    shortDescription: course?.shortDescription ?? "",
    description: course?.description ?? "",
    enrollmentUrl: course?.enrollmentUrl ?? "",
    featured: course?.featured ?? true,
    published: course?.published ?? true,
  });
  const [image, setImage] = useState<CompressedImage | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const busy = saving || processingImage;
  const preview = image?.previewUrl ?? course?.image;

  function update<K extends keyof CourseInput>(key: K, value: CourseInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setProcessingImage(true);
    try {
      setImage(await compressImage(file));
    } catch (err) {
      setError(errorMessage(err));
      event.target.value = "";
    } finally {
      setProcessingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.shortDescription.trim()) {
      setError("Preencha o título e a descrição do card.");
      return;
    }
    if (form.enrollmentUrl.trim() && !validExternalUrl(form.enrollmentUrl.trim())) {
      setError("O link do botão “Quero me inscrever” precisa ser um endereço completo, começando com https://");
      return;
    }
    if (!course && !image) {
      setError("Escolha uma imagem para o card.");
      return;
    }

    setSaving(true);
    try {
      await withTimeout(
        (async () => {
          if (seedSamples) await ensureSampleCoursesImported(sampleCourses);
          if (course) await updateCourse(course.id, form, image);
          else if (image) await createCourse(form, image);
        })(),
      );
      onChanged();
      router.refresh();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!course || !window.confirm(`Excluir o curso “${course.title}”? Esta ação não pode ser desfeita.`)) return;
    setError("");
    setSaving(true);
    try {
      await withTimeout(
        (async () => {
          if (seedSamples) await ensureSampleCoursesImported(sampleCourses);
          await deleteCourse(course.id);
        })(),
      );
      onChanged();
      if (pathname === `/cursos/${course.slug}`) router.push("/#cursos");
      else router.refresh();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="course-editor"
      aria-labelledby="course-editor-title"
      onClose={onClose}
      onCancel={(event) => {
        if (busy) event.preventDefault();
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <h2 id="course-editor-title">{isEditing ? "Editar curso" : "Novo curso"}</h2>

        <div className="editor-field">
          <span>Imagem do card</span>
          <div className="editor-image">
            {preview ? (
              <Image src={preview} alt="Pré-visualização da imagem do curso" fill unoptimized />
            ) : (
              <p>Nenhuma imagem selecionada</p>
            )}
          </div>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} disabled={busy} />
          <span className="editor-hint">
            {processingImage
              ? "Processando imagem…"
              : "JPG, PNG ou WebP. A imagem é reduzida e comprimida automaticamente. Proporção ideal: horizontal (cerca de 2,4 × 1)."}
          </span>
        </div>

        <label className="editor-field">
          <span>Título</span>
          <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} maxLength={120} required />
        </label>

        <label className="editor-field">
          <span>Descrição do card</span>
          <textarea
            rows={3}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            maxLength={220}
            required
          />
          <span className="editor-hint">Texto curto exibido no carrossel.</span>
        </label>

        <label className="editor-field">
          <span>Texto da página do curso</span>
          <textarea rows={6} value={form.description} onChange={(e) => update("description", e.target.value)} />
          <span className="editor-hint">Exibido em /cursos/… Quebras de linha são mantidas.</span>
        </label>

        <label className="editor-field">
          <span>Link do botão “Quero me inscrever”</span>
          <input
            type="url"
            inputMode="url"
            placeholder="https://plataforma-do-curso.com/…"
            value={form.enrollmentUrl}
            onChange={(e) => update("enrollmentUrl", e.target.value)}
          />
          <span className="editor-hint">
            Endereço onde o curso está hospedado; abre em nova aba, a partir da página do curso. Se ficar vazio, o botão
            aparece desativado com “Inscrições ainda não disponíveis”.
          </span>
        </label>

        <div className="editor-checks">
          <label>
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Publicado
          </label>
          <label>
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Exibir no carrossel da Home
          </label>
        </div>

        {error && (
          <p className="editor-error" role="alert">
            {error}
          </p>
        )}

        <div className="editor-actions">
          {isEditing && (
            <button type="button" className="admin-button admin-button-danger editor-delete" onClick={handleDelete} disabled={busy}>
              Excluir
            </button>
          )}
          <button type="button" className="admin-button admin-button-light" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button type="submit" className="admin-button" disabled={busy}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
