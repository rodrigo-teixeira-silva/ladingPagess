import { cache } from "react";
import { connection } from "next/server";
import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { pageDefinitions, type PageId } from "@/data/pages";
import { PAGES_COLLECTION } from "@/services/pageServices";
import { readFirestore } from "@/lib/firestoreRead";

export interface PageContent {
  values: Record<string, string>;
  /** `error`: Firestore inacessível; os valores são os padrões do código. */
  source: "firestore" | "default" | "error";
}

/** Conteúdo da página: o que foi salvo no Firestore, completado pelos padrões do código. Lido a cada requisição. */
export const getPageContent = cache(async (pageId: PageId): Promise<PageContent> => {
  await connection();
  const { defaults, fields } = pageDefinitions[pageId];
  try {
    const snapshot = await readFirestore(`página "${pageId}"`, () => getDocFromServer(doc(db, PAGES_COLLECTION, pageId)));
    const saved = snapshot.data();
    if (!saved) return { values: { ...defaults }, source: "default" };

    const values = { ...defaults };
    for (const { key, type } of fields) {
      const value = saved[key];
      if (typeof value !== "string") continue;
      // Campos obrigatórios (título/imagem) vazios voltam ao padrão; opcionais podem ficar vazios.
      if (value || type === "email" || type === "tel" || type === "textarea") values[key] = value;
    }
    return { values, source: "firestore" };
  } catch {
    return { values: { ...defaults }, source: "error" };
  }
});

/** Divide o texto em parágrafos (linhas em branco separam). */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}
