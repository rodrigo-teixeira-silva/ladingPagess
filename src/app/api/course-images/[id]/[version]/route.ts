import { serveFirestoreImage } from "@/lib/serveFirestoreImage";
import { COURSE_IMAGES_COLLECTION } from "@/services/courseServices";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; version: string }> },
) {
  const { id } = await params;
  return serveFirestoreImage(COURSE_IMAGES_COLLECTION, id);
}
