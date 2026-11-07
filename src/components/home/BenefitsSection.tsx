import { SiteIcon, type SiteIconName } from '@/components/ui/SiteIcon';
import { Container } from '@/components/ui/Container';
const benefits: {icon: SiteIconName; title: string; text: string}[] = [
  {icon:'aulas-objetivas',title:'Aulas objetivas',text:'e didáticas'},
  {icon:'foco-resultados',title:'Foco em resultados',text:'Concursos, ENEM e vestibulares'},
  {icon:'exercicios',title:'Exercícios e simulados',text:'comentados'},
  {icon:'materiais',title:'Materiais',text:'atualizados'},
];
export function BenefitsSection(){return <section className="benefits" aria-label="Benefícios"><Container>{benefits.map(({icon,title,text})=><div key={title}><SiteIcon name={icon} size={30}/><p><strong>{title}</strong><span>{text}</span></p></div>)}</Container></section>;}
