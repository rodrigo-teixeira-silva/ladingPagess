"use client";

import Link from 'next/link';
import Image from 'next/image';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { LoginButton } from '@/components/ui/LoginButton';
import { useAdmin } from '@/components/admin/AdminProvider';
import { logout } from '@/services/authServices';

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Edson Botelho Jr. — Início">
      <Image
        src="/assets/logo-edson-botelho.svg"
        alt="Edson Botelho Jr. — Linguagens e Redação"
        width={520}
        height={110}
      />
    </Link>
  );
}

export function Header() {
  const { user, isAdmin, loading } = useAdmin();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className="header">
      <Container>
        <Brand />
        <Navbar />

        <div className="header-cta flex items-center gap-2">
          {!isAdmin && <Button href="/#cursos">Ver Cursos</Button>}

          {loading ? (
            <div className="w-[100px] h-[40px] bg-slate-700 animate-pulse rounded-lg"></div>
          ) : isAdmin ? (
            <div className="flex items-center gap-3">
              <Link href="/admin/cursos" className="text-sm font-bold text-yellow-300 hover:text-yellow-200">
                Painel
              </Link>
              <span className="text-sm font-medium text-white max-w-[100px] truncate">
                {user?.displayName?.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 font-bold"
              >
                Sair
              </button>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>

        <MobileMenu />
      </Container>
    </header>
  );
}
