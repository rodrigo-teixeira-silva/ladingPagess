import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicCatalog } from '@/lib/publicCourses';
import { validExternalUrl } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AdminCoursePageBar } from '@/components/admin/AdminCoursePageBar';

async function findCourse(slug: string) {
  const catalog = await getPublicCatalog();
  return catalog.courses.find(c => c.slug === slug);
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const course=await findCourse((await params).slug);
  return course?{title:course.title,description:course.shortDescription}:{};
}

export default async function CoursePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const course=await findCourse(slug);
  if(!course)notFound();
  const url=validExternalUrl(course.enrollmentUrl);
  return <section className="simple-page"><Container>
    <Link className="back-link" href="/#cursos">← Todos os cursos</Link>
    <AdminCoursePageBar course={course}/>
    <div className="course-detail">
      {course.image&&<Image src={course.image} alt={`Capa do curso ${course.title}`} width={640} height={360} priority/>}
      <div><span className="eyebrow">APRENDA COM DIREÇÃO</span><h1>{course.title}</h1><p className="course-detail-text">{course.description||course.shortDescription}</p>
        {url?<Button href={url} external>Quero me inscrever</Button>:<><Button disabled describedBy="enrollment-status">Quero me inscrever</Button><p id="enrollment-status" className="enrollment-note">Inscrições ainda não disponíveis. Novidades em breve.</p></>}
      </div>
    </div>
  </Container></section>;
}
