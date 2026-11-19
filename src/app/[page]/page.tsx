import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isPageId } from '@/data/pages';
import { getPageContent, paragraphs } from '@/lib/pageContent';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AdminPageBar } from '@/components/admin/AdminPageBar';

export async function generateMetadata({params}:{params:Promise<{page:string}>}):Promise<Metadata>{
  const {page}=await params;
  if(!isPageId(page)||page==='home')return {};
  const {values}=await getPageContent(page);
  return {title:values.title,description:paragraphs(values.body)[0]};
}

export default async function PublicPage({params}:{params:Promise<{page:string}>}){
  const {page}=await params;
  if(!isPageId(page)||page==='home')notFound();
  const content=await getPageContent(page);
  const {values}=content;
  const phoneHref=values.phone?`tel:${values.phone.replace(/[^\d+]/g,'')}`:'';
  return <section className="simple-page"><Container>
    <AdminPageBar pageId={page} content={content}/>
    <span className="eyebrow">EDSON BOTELHO JR. · LINGUAGENS E REDAÇÃO</span>
    <h1>{values.title}</h1>
    {paragraphs(values.body).map((text,i)=><p key={i}>{text}</p>)}
    {page==='contato'&&values.email&&<p><a href={`mailto:${values.email}`}>{values.email}</a></p>}
    {page==='contato'&&values.phone&&<p><a href={phoneHref}>{values.phone}</a></p>}
    <Button href="/#cursos">Conheça os cursos</Button>
    <Link className="back-link" href="/">← Voltar ao início</Link>
  </Container></section>;
}
