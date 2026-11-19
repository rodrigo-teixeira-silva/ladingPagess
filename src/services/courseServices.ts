import {
  collection,
  doc,
  getDocsFromServer,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CompressedImage, Course, CourseInput } from "@/types/course";

export const COURSES_COLLECTION = "courses";
/** Imagens ficam em uma coleção separada para não pesar a listagem de cursos. */
export const COURSE_IMAGES_COLLECTION = "courseImages";

function toCourse(id: string, data: DocumentData): Course {
  return {
    id,
    slug: typeof data.slug === "string" && data.slug ? data.slug : id,
    title: typeof data.title === "string" ? data.title : "",
    shortDescription: typeof data.shortDescription === "string" ? data.shortDescription : "",
    description: typeof data.description === "string" ? data.description : "",
    image: typeof data.image === "string" ? data.image : "",
    featured: data.featured === true,
    published: data.published === true,
    order: typeof data.order === "number" ? data.order : 0,
    enrollmentUrl:
      typeof data.enrollmentUrl === "string" && data.enrollmentUrl ? data.enrollmentUrl : undefined,
  };
}

function byOrder(a: Course, b: Course) {
  return a.order - b.order || a.title.localeCompare(b.title, "pt-BR");
}

function cleanInput(input: CourseInput) {
  return {
    title: input.title.trim(),
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    enrollmentUrl: input.enrollmentUrl.trim(),
    featured: input.featured,
    published: input.published,
  };
}

export function courseImagePath(courseId: string, version: number) {
  return `/api/course-images/${courseId}/${version}`;
}

export function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "curso"
  );
}

/** Cursos publicados (site público). */
export async function getPublishedCourses(): Promise<Course[]> {
  const snapshot = await getDocsFromServer(
    query(collection(db, COURSES_COLLECTION), where("published", "==", true)),
  );
  return snapshot.docs.map((d) => toCourse(d.id, d.data())).sort(byOrder);
}

/** Todos os cursos, inclusive rascunhos (somente admin, pelas regras do Firestore). */
export async function getAllCourses(): Promise<Course[]> {
  const snapshot = await getDocsFromServer(collection(db, COURSES_COLLECTION));
  return snapshot.docs.map((d) => toCourse(d.id, d.data())).sort(byOrder);
}

async function uniqueSlug(title: string) {
  const base = slugify(title);
  for (let i = 1; ; i++) {
    const candidate = i === 1 ? base : `${base}-${i}`;
    const existing = await getDocsFromServer(
      query(collection(db, COURSES_COLLECTION), where("slug", "==", candidate)),
    );
    if (existing.empty) return candidate;
  }
}

async function saveCourseImage(courseId: string, image: CompressedImage) {
  await setDoc(doc(db, COURSE_IMAGES_COLLECTION, courseId), {
    data: image.base64,
    contentType: image.contentType,
    updatedAt: serverTimestamp(),
  });
  return courseImagePath(courseId, Date.now());
}

export async function createCourse(input: CourseInput, image: CompressedImage): Promise<Course> {
  const ref = doc(collection(db, COURSES_COLLECTION));
  const [slug, courses] = await Promise.all([uniqueSlug(input.title), getAllCourses()]);
  const order = courses.reduce((max, c) => Math.max(max, c.order), 0) + 1;
  const imagePath = await saveCourseImage(ref.id, image);
  const data = { ...cleanInput(input), slug, order, image: imagePath };

  await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return toCourse(ref.id, data);
}

export async function updateCourse(id: string, input: CourseInput, image?: CompressedImage | null) {
  const imagePath = image ? await saveCourseImage(id, image) : undefined;
  await updateDoc(doc(db, COURSES_COLLECTION, id), {
    ...cleanInput(input),
    ...(imagePath ? { image: imagePath } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCourse(id: string) {
  const batch = writeBatch(db);
  batch.delete(doc(db, COURSES_COLLECTION, id));
  batch.delete(doc(db, COURSE_IMAGES_COLLECTION, id));
  await batch.commit();
}

/**
 * Copia os cursos de exemplo para o Firestore (mantendo os mesmos ids), somente se a coleção estiver vazia.
 * Chamado antes da primeira gravação feita a partir dos exemplos, para que nenhum deles suma do site.
 */
export async function ensureSampleCoursesImported(samples: Course[]) {
  const existing = await getAllCourses();
  if (existing.length) return;

  const batch = writeBatch(db);
  for (const sample of samples) {
    const { id, enrollmentUrl, isSample: _sample, ...rest } = sample;
    void _sample;
    batch.set(doc(db, COURSES_COLLECTION, id), {
      ...rest,
      enrollmentUrl: enrollmentUrl ?? "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}
