"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { pageDefinitions, type PageField, type PageId } from "@/data/pages";
import { compressImage } from "@/lib/imageCompression";
import { firestoreErrorMessage, withTimeout } from "@/lib/firestoreErrors";
import { savePageContent } from "@/services/pageServices";
import type { CompressedImage } from "@/types/course";

interface Props {
  pageId: PageId;
  values: Record<string, string>;
  onClose: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PageEditorDialog({ pageId, values: initialValues, onClose }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const definition = pageDefinitions[pageId];

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [images, setImages] = useState<Record<string, CompressedImage>>({});
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const busy = saving || processing;

  async function handleImage(key: string, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const image = await compressImage(file, 1920);
      setImages((current) => ({ ...current, [key]: image }));
    } catch (err) {
      setError(firestoreErrorMessage(err));
      event.target.value = "";
    } finally {
      setProcessing(false);
    }
  }

  function validate() {
    for (const field of definition.fields) {
      const value = (values[field.key] ?? "").trim();
      if (field.type === "text" && !value) return `Preencha o campo “${field.label}”.`;
      if (field.type === "email" && value && !EMAIL_PATTERN.test(value)) return "Informe um e-mail válido.";
    }
    return "";
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSaving(true);
    try {
      const textValues = Object.fromEntries(
        definition.fields.filter((f) => f.type !== "image").map((f) => [f.key, values[f.key] ?? ""]),
      );
      await withTimeout(savePageContent(pageId, textValues, images));
      router.refresh();
      onClose();
    } catch (err) {
      setError(firestoreErrorMessage(err));
      setSaving(false);
    }
  }

  function renderField(field: PageField) {
    const value = values[field.key] ?? "";
    const update = (next: string) => setValues((current) => ({ ...current, [field.key]: next }));

    if (field.type === "image") {
      const preview = images[field.key]?.previewUrl ?? value;
      return (
        <div className="editor-field" key={field.key}>
          <span>{field.label}</span>
          <div className="editor-image editor-image-wide">
            {preview ? <Image src={preview} alt="Pré-visualização" fill unoptimized /> : <p>Nenhuma imagem</p>}
          </div>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleImage(field.key, e)} disabled={busy} />
          <span className="editor-hint">{processing ? "Processando imagem…" : field.hint}</span>
        </div>
      );
    }

    return (
      <label className="editor-field" key={field.key}>
        <span>{field.label}</span>
        {field.type === "textarea" ? (
          <textarea rows={field.key === "body" ? 8 : 3} value={value} onChange={(e) => update(e.target.value)} />
        ) : (
          <input type={field.type === "text" ? "text" : field.type} value={value} onChange={(e) => update(e.target.value)} />
        )}
        {field.hint && <span className="editor-hint">{field.hint}</span>}
      </label>
    );
  }

  // Agrupa campos consecutivos com o mesmo `group`.
  const groups: { title?: string; fields: PageField[] }[] = [];
  for (const field of definition.fields) {
    const last = groups[groups.length - 1];
    if (last && last.title === field.group) last.fields.push(field);
    else groups.push({ title: field.group, fields: [field] });
  }

  return (
    <dialog
      ref={dialogRef}
      className="course-editor"
      aria-labelledby="page-editor-title"
      onClose={onClose}
      onCancel={(event) => {
        if (busy) event.preventDefault();
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <h2 id="page-editor-title">Editar: {definition.name}</h2>

        {groups.map((group, index) =>
          group.title ? (
            <fieldset className="editor-group" key={group.title}>
              <legend>{group.title}</legend>
              {group.fields.map(renderField)}
            </fieldset>
          ) : (
            <div className="editor-group-plain" key={index}>
              {group.fields.map(renderField)}
            </div>
          ),
        )}

        {error && (
          <p className="editor-error" role="alert">
            {error}
          </p>
        )}

        <div className="editor-actions">
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
