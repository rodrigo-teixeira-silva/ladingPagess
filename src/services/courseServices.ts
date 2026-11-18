// services/courseServices.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from "@/types/course";

const COURSES_COLLECTION = "courses";

// 1. Adicionar um novo curso
export async function addCourse(courseData: Omit<Course, "id">) {
  const docRef = await addDoc(collection(db, COURSES_COLLECTION), {
    ...courseData,
    createdAt: new Date(),
  });
  return docRef.id;
}

// 2. Buscar todos os cursos (para o carrossel e painel admin)
export async function getCourses() {
  const q = query(collection(db, COURSES_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Course[];
}

// 3. Atualizar um curso existente
export async function updateCourse(id: string, data: Partial<Course>) {
  const docRef = doc(db, COURSES_COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: new Date() });
}

// 4. Excluir um curso
export async function deleteCourse(id: string) {
  const docRef = doc(db, COURSES_COLLECTION, id);
  await deleteDoc(docRef);
}