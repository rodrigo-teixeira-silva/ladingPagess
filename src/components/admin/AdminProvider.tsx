"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdminUser } from "@/lib/admin";
import type { Course } from "@/types/course";
import { CourseEditorDialog } from "./CourseEditorDialog";

interface AdminContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  /**
   * Sem curso: cria um novo. Com curso: edita.
   * `seedSamples`: o site está exibindo os exemplos locais; copie-os para o Firestore antes de gravar.
   */
  openCourseEditor: (course?: Course, options?: { seedSamples?: boolean }) => void;
  /** Incrementa a cada criação/edição/exclusão, para telas que mantêm lista própria. */
  revision: number;
  notifyChange: () => void;
}

/** Fora do provider (ou durante um recarregamento a quente), trata o usuário como visitante. */
const VISITOR: AdminContextValue = {
  user: null,
  isAdmin: false,
  loading: true,
  openCourseEditor: () => {},
  revision: 0,
  notifyChange: () => {},
};

const AdminContext = createContext<AdminContextValue>(VISITOR);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<{ open: boolean; course?: Course; seedSamples?: boolean }>({ open: false });
  const [revision, setRevision] = useState(0);

  useEffect(
    () =>
      onAuthStateChanged(auth, (current) => {
        setUser(current);
        setLoading(false);
      }),
    [],
  );

  const isAdmin = isAdminUser(user);
  const openCourseEditor = useCallback(
    (course?: Course, options?: { seedSamples?: boolean }) =>
      setEditor({ open: true, course, seedSamples: Boolean(course?.isSample || options?.seedSamples) }),
    [],
  );
  const closeEditor = useCallback(() => setEditor({ open: false }), []);
  const notifyChange = useCallback(() => setRevision((value) => value + 1), []);

  const value = useMemo(
    () => ({ user, isAdmin, loading, openCourseEditor, revision, notifyChange }),
    [user, isAdmin, loading, openCourseEditor, revision, notifyChange],
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
      {isAdmin && editor.open && (
        <CourseEditorDialog
          key={editor.course?.id ?? "novo"}
          course={editor.course}
          seedSamples={editor.seedSamples ?? false}
          onClose={closeEditor}
          onChanged={notifyChange}
        />
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
