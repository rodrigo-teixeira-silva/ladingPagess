export interface Course {
  id: string; slug: string; title: string; shortDescription: string; description: string;
  image: string; featured: boolean; published: boolean; order: number; enrollmentUrl?: string;
  /** Curso de exemplo local (ainda não está no Firestore). */
  isSample?: boolean;
}

/** Campos que o admin edita pelo formulário. */
export interface CourseInput {
  title: string;
  shortDescription: string;
  description: string;
  enrollmentUrl: string;
  featured: boolean;
  published: boolean;
}

/** Imagem já comprimida no navegador, pronta para gravar no Firestore. */
export interface CompressedImage {
  base64: string;
  contentType: string;
  previewUrl: string;
}
