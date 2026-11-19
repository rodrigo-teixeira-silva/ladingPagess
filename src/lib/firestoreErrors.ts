import { FirebaseError } from "firebase/app";

export const OFFLINE_MESSAGE =
  "Não foi possível conectar ao Firestore. Confira se o banco foi criado no console do Firebase e se as regras foram publicadas.";

/** Mensagem amigável para erros de gravação no Firestore. */
export function firestoreErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === "permission-denied") {
      return "Sem permissão para gravar. Confira se você está logado como admin e se as regras do Firestore foram publicadas.";
    }
    if (error.code === "unavailable" || error.code === "failed-precondition") return OFFLINE_MESSAGE;
    if (error.code === "not-found") return "Este conteúdo não existe mais no Firestore. Recarregue a página.";
  }
  return error instanceof Error ? error.message : "Não foi possível concluir a operação.";
}

/** Sem conexão, gravações do Firestore ficam pendentes indefinidamente; limita a espera. */
export function withTimeout<T>(promise: Promise<T>, ms = 20_000) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(OFFLINE_MESSAGE)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}
