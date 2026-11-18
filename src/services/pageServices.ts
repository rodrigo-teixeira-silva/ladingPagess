import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CompressedImage } from "@/types/course";

export const PAGES_COLLECTION = "pages";
export const SITE_IMAGES_COLLECTION = "siteImages";

export function siteImagePath(imageId: string, version: number) {
  return `/api/site-images/${imageId}/${version}`;
}

/** Salva o conteúdo de uma página. Imagens novas são gravadas em siteImages e viram um caminho servido pelo site. */
export async function savePageContent(
  pageId: string,
  values: Record<string, string>,
  images: Record<string, CompressedImage>,
) {
  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) data[key] = value.trim();

  for (const [key, image] of Object.entries(images)) {
    const imageId = `${pageId}-${key}`;
    await setDoc(doc(db, SITE_IMAGES_COLLECTION, imageId), {
      data: image.base64,
      contentType: image.contentType,
      updatedAt: serverTimestamp(),
    });
    data[key] = siteImagePath(imageId, Date.now());
  }

  await setDoc(doc(db, PAGES_COLLECTION, pageId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
