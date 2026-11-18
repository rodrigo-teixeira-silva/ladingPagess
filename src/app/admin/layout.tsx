"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/components/admin/AdminProvider";

/**
 * Bloqueia a área /admin para quem não é admin.
 * A proteção dos dados em si é feita pelas regras do Firestore (firestore.rules).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/");
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return <p className="p-10 text-center">Verificando acesso…</p>;
  }

  return children;
}
