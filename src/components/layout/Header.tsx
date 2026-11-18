import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Navbar } from './Navbar';
import { MobileMenu } from './MobileMenu';
import { LoginButton } from '../ui/LoginButton';

export function Brand() {
    return <Link href="/"
        className="brand" aria-label="Edson Botelho Jr. — Início">
        <Image src="/assets/logo-edson-botelho.svg" alt="Edson Botelho Jr. — Linguagens e Redação" width={520} height={110} />
    </Link>;
}
export function Header() 
{ return <header className="header"><Container><Brand /><Navbar />

<div className="header-cta flex items-center gap-2">
  <Button href="/#cursos">Ver Cursos</Button>

 <LoginButton />
</div>


<MobileMenu /></Container></header>; }
