import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { isAdminUser } from "@/lib/admin";

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);

  if (!isAdminUser(user)) {
    await signOut(auth);
    throw new Error("Você não possui permissão de administrador.");
  }

  return user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
