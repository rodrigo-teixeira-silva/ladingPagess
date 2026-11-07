import Link from 'next/link';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SiteIcon, type SiteIconName } from '@/components/ui/SiteIcon';

export const metadata: Metadata = { title: 'Conteúdos Gratuitos', description: 'Explore artigos, simulados e aulas básicas de Linguagens e Redação.' };
const categories: {title: string; href: string; icon: SiteIconName; description: string}[] = [
  {title:'Artigos', href:'/artigos', icon:'artigos', description:'Leituras sobre língua portuguesa, literatura e redação.'},
  {title:'Simulados', href:'/simulados', icon:'simulados', description:'Um espaço para praticar e revisar seus conhecimentos.'},
  {title:'Aulas Básicas', href:'/aulas-basicas', icon:'aulas', description:'Conheça os fundamentos para sua jornada de estudos.'},
];
export default function FreeContentPage() {
  return <section className="simple-page"><Container><h1>Conteúdos Gratuitos</h1><p>Escolha uma categoria para explorar. Os primeiros materiais serão disponibilizados em breve.</p><div className="content-hub">{categories.map(item => <Link href={item.href} key={item.href}><SiteIcon name={item.icon} size={32}/><h2>{item.title}</h2><p>{item.description}</p><span>Explorar <SiteIcon name="arrow-right" size={17}/></span></Link>)}</div><Link className="back-link" href="/">← Voltar ao início</Link></Container></section>;
}
