'use client';
import { useEffect, useRef, useState } from 'react';
import { SiteIcon } from '@/components/ui/SiteIcon';
import { navigationIcons } from './Navbar';
import Link from 'next/link';
import { navigation } from '@/data/navigation';
export function MobileMenu(){const [open,setOpen]=useState(false);const toggle=useRef<HTMLButtonElement>(null);const panel=useRef<HTMLDivElement>(null);
useEffect(()=>{if(!open)return;function close(e:KeyboardEvent){if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}}function outside(e:PointerEvent){if(!panel.current?.contains(e.target as Node)&&!toggle.current?.contains(e.target as Node))setOpen(false);}document.addEventListener('keydown',close);document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside);};},[open]);
return <div className="mobile-menu"><button ref={toggle} className="icon-button" aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}><SiteIcon name={open ? 'close' : 'menu'}/></button>{open&&<div ref={panel} id="mobile-navigation"><nav aria-label="Navegação móvel">{navigation.map(n=><Link key={n.href} href={n.href} onClick={()=>setOpen(false)}><SiteIcon name={navigationIcons[n.href]} size={18}/>{n.label}</Link>)}<Link href="/#cursos" onClick={()=>setOpen(false)}>Ver cursos →</Link></nav></div>}</div>;}
