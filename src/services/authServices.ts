
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = "rodrigo.developer376@gmail.com";

export async function loginWithGoogle(): Promise<User> {
    
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  const user = result.user;

  const isAdmin =
    user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    user.emailVerified;

  if (!isAdmin) {
    await signOut(auth);

    throw new Error("Você não possui permissão de administrador.");
  }

  return user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
