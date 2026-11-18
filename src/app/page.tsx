import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { CourseHighlights } from '@/components/home/CourseHighlights';
import { FreeContentSection } from '@/components/home/FreeContentSection';
import { AdminPageBar } from '@/components/admin/AdminPageBar';
import { Container } from '@/components/ui/Container';
import { getPageContent } from '@/lib/pageContent';

export default async function Home(){
  const content=await getPageContent('home');
  const {values}=content;
  return <>
    <Container><AdminPageBar pageId="home" content={content} label="Editar página inicial" className="admin-home-bar"/></Container>
    <HeroSection content={values}/>
    <BenefitsSection content={values}/>
    <CourseHighlights/>
    <FreeContentSection content={values}/>
  </>;
}
