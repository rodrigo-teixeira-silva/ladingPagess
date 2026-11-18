import { SiteIcon, type SiteIconName } from '@/components/ui/SiteIcon';
import { Container } from '@/components/ui/Container';
const icons: SiteIconName[] = ['aulas-objetivas','foco-resultados','exercicios','materiais'];
export function BenefitsSection({content}:{content:Record<string,string>}){
  return <section className="benefits" aria-label="Benefícios"><Container>{icons.map((icon,i)=>{
    const title=content[`benefit${i+1}Title`];const text=content[`benefit${i+1}Text`];
    return <div key={icon}><SiteIcon name={icon} size={30}/><p><strong>{title}</strong>{text&&<span>{text}</span>}</p></div>;
  })}</Container></section>;
}
