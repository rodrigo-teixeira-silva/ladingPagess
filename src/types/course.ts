export interface Course {
  id: string; slug: string; title: string; shortDescription: string; description: string;
  image: string; featured: boolean; published: boolean; order: number; enrollmentUrl?: string;
}
