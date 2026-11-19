import type { User } from "firebase/auth";

/**
 * Lista de admins vinda de NEXT_PUBLIC_ADMIN_EMAILS (separada por vírgula) no .env.local.
 * A mesma variável gera firestore.rules (`npm run rules`), que é a proteção real dos dados.
 * Alterou a lista? Reinicie o `npm run dev` (ou refaça o build) e publique as regras novamente.
 */
export const ADMIN_EMAILS: readonly string[] = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminUser(user: User | null | undefined): user is User {
  const email = user?.email?.toLowerCase();
  return Boolean(user?.emailVerified && email && ADMIN_EMAILS.includes(email));
}
