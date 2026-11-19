import { withTimeout } from "@/lib/firestoreErrors";

/**
 * Leituras do Firestore feitas no servidor (páginas públicas e imagens).
 *
 * Quando o Firestore falha (banco não criado, sem rede, regras), o SDK fica tentando reconectar e cada leitura
 * esperaria o tempo limite. Por isso, depois de uma falha, as próximas leituras desistem na hora durante
 * PAUSE_MS e o site usa o conteúdo padrão. O erro é registrado uma vez por pausa, não a cada requisição.
 */
const TIMEOUT_MS = 5_000;
const PAUSE_MS = 60_000;

let pausedUntil = 0;

export class FirestorePausedError extends Error {
  constructor() {
    super("Firestore temporariamente ignorado após falha recente.");
  }
}

export async function readFirestore<T>(label: string, read: () => Promise<T>): Promise<T> {
  if (Date.now() < pausedUntil) throw new FirestorePausedError();
  try {
    return await withTimeout(read(), TIMEOUT_MS);
  } catch (error) {
    pausedUntil = Date.now() + PAUSE_MS;
    const reason = error instanceof Error ? error.message.split("\n")[0] : String(error);
    console.warn(
      `[firestore] Falha ao ler ${label}: ${reason} — usando conteúdo padrão; nova tentativa em ${PAUSE_MS / 1000}s.`,
    );
    throw error;
  }
}
