'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@/data/navigation';
import { SiteIcon, type SiteIconName } from '@/components/ui/SiteIcon';
export const navigationIcons: Record<string, SiteIconName> = { '/':'home', '/artigos':'artigos', '/simulados':'simulados', '/aulas-basicas':'aulas', '/sobre':'sobre', '/contato':'contato' };
export function Navbar(){const pathname=usePathname();return <nav className="desktop-nav" aria-label="Navegação principal">{navigation.map(n=><Link href={n.href} key={n.href} aria-current={pathname===n.href?'page':undefined}><SiteIcon name={navigationIcons[n.href]} size={16}/>{n.label}</Link>)}</nav>;}
