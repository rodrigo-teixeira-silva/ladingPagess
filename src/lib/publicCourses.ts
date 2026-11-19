import { cache } from "react";
import { connection } from "next/server";
import { sampleCourses } from "@/data/courses";
import { getPublishedCourses } from "@/services/courseServices";
import { readFirestore } from "@/lib/firestoreRead";
import type { Course } from "@/types/course";

/**
 * - `firestore`: cursos vindos do banco (editáveis pelo admin).
 * - `empty`: banco sem cursos publicados; o site mostra os exemplos locais.
 * - `error`: falha ao ler o banco (ex.: regras não publicadas); o site mostra os exemplos locais.
 */
export type CatalogSource = "firestore" | "empty" | "error";

export interface PublicCatalog {
  courses: Course[];
  source: CatalogSource;
}

const samples = sampleCourses.map((course) => ({ ...course, isSample: true }));

/** Lido a cada requisição, para que edições do admin apareçam imediatamente. */
export const getPublicCatalog = cache(async (): Promise<PublicCatalog> => {
  await connection();
  try {
    const courses = await readFirestore("cursos", getPublishedCourses);
    if (courses.length) return { courses, source: "firestore" };
    return { courses: samples, source: "empty" };
  } catch {
    return { courses: samples, source: "error" };
  }
});
