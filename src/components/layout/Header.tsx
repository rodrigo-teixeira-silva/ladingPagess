// components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { LoginButton } from '@/components/ui/LoginButton';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
          <Button href="/#cursos">Ver Cursos</Button>
          
          {loading ? (
            <div className="w-[100px] h-[40px] bg-slate-700 animate-pulse rounded-lg"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Se quiser a foto, descomente a linha abaixo */}
              {/* <Image src={user.photoURL || ""} alt="Avatar" width={32} height={32} className="rounded-full border border-yellow-400" /> */}
              
              <span className="text-sm font-medium text-white max-w-[100px] truncate">
                {user.displayName?.split(' ')[0]}
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