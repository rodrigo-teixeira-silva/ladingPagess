
"use client";

import { useState, type ComponentProps, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { loginWithGoogle } from "@/services/authServices";

const ButtonWithClick = Button as ComponentType<
  ComponentProps<typeof Button> & { onClick: () => void }
>;

export function LoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(): Promise<void> {
    try {
      setLoading(true);

      await loginWithGoogle();

      router.push("/admin");
    } catch (error) {
      console.error("Erro no login:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao realizar login."
      );
    } finally {
      setLoading(false);
    }
  }

   return (
    <Button
      onClick={() => void handleLogin()}
      secondary
      icon={null}
    >
      {loading ? "Entrando..." : "Login"}
    </Button>
  );
}
