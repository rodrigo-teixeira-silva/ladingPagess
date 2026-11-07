import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicPages } from '@/data/navigation';
import { site } from '@/data/site';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
export function generateStaticParams(){return Object.keys(publicPages).map(page=>({page}));}
export async function generateMetadata({params}:{params:Promise<{page:string}>}):Promise<Metadata>{const data=publicPages[(await params).page];return data?{title:data.title,description:data.description}:{};}
export default async function PublicPage({params}:{params:Promise<{page:string}>}){const {page}=await params;const data=publicPages[page];if(!data)notFound();return <section className="simple-page"><Container><span className="eyebrow">EDSON BOTELHO JR. · LINGUAGENS E REDAÇÃO</span><h1>{data.title}</h1><p>{data.description}</p>{page==='contato'&&site.contact.email&&<p><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>}{page==='contato'&&site.contact.phone&&<p>{site.contact.phone}</p>}<Button href="/#cursos">Conheça os cursos</Button><Link className="back-link" href="/">← Voltar ao início</Link></Container></section>;}
