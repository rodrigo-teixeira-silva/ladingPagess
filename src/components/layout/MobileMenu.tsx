// components/layout/MobileMenu.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { SiteIcon } from '@/components/ui/SiteIcon';
import { navigationIcons } from './Navbar';
import Link from 'next/link';
import { navigation } from '@/data/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoginButton } from '@/components/ui/LoginButton';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Estado para o usuário
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Escuta o estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    function close(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function outside(e: PointerEvent) {
      if (!panel.current?.contains(e.target as Node) && !toggle.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false); // Fecha o menu após sair
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="mobile-menu">
      <button
        ref={toggle}
        className="icon-button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        <SiteIcon name={open ? 'close' : 'menu'} />
      </button>
      
      {open && (
        <div ref={panel} id="mobile-navigation">
          <nav aria-label="Navegação móvel">
            {navigation.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
                <SiteIcon name={navigationIcons[n.href]} size={18} />
                {n.label}
              </Link>
            ))}
            
            <Link href="/#cursos" onClick={() => setOpen(false)}>
              Ver cursos →
            </Link>

            {/* Lógica de Autenticação no Mobile */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #2a4c6a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              {user ? (
                <>
                  <span className="text-white font-medium">Olá, {user.displayName?.split(' ')[0]}</span>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 transition"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <LoginButton />
              )}
            </div>
            
          </nav>
        </div>
      )}
    </div>
  );
}