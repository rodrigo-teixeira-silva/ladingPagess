import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { readFirestore } from "@/lib/firestoreRead";

const ALLOWED_TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

/**
 * Responde com a imagem (base64) guardada em `collectionName/imageId`.
 * A URL inclui uma versão que muda a cada upload, então a resposta pode ser cacheada para sempre.
 */
export async function serveFirestoreImage(collectionName: string, imageId: string) {
  try {
    const snapshot = await readFirestore(`imagem ${collectionName}/${imageId}`, () =>
      getDocFromServer(doc(db, collectionName, imageId)),
    );
    const data = snapshot.data();
    if (!data || typeof data.data !== "string") {
      return new Response("Imagem não encontrada.", { status: 404 });
    }

    const contentType = ALLOWED_TYPES.has(data.contentType) ? data.contentType : "image/webp";
    return new Response(new Uint8Array(Buffer.from(data.data, "base64")), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Imagem indisponível no momento.", { status: 503 });
  }
}
