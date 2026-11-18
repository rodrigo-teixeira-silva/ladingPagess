import { serveFirestoreImage } from "@/lib/serveFirestoreImage";
import { SITE_IMAGES_COLLECTION } from "@/services/pageServices";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; version: string }> },
) {
  const { id } = await params;
  return serveFirestoreImage(SITE_IMAGES_COLLECTION, id);
}
