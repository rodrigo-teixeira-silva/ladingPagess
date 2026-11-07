import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { courses } from '@/data/courses';
import { validExternalUrl } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
export function generateStaticParams(){return courses.filter(c=>c.published).map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const slug=(await params).slug;const course=courses.find(c=>c.published&&c.slug===slug);return course?{title:course.title,description:course.shortDescription}:{};}
export default async function CoursePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const course=courses.find(c=>c.published&&c.slug===slug);if(!course)notFound();const url=validExternalUrl(course.enrollmentUrl);return <section className="simple-page"><Container><Link className="back-link" href="/#cursos">← Todos os cursos</Link><div className="course-detail"><Image src={course.image} alt={`Capa do curso ${course.title}`} width={640} height={360} priority/><div><span className="eyebrow">APRENDA COM DIREÇÃO</span><h1>{course.title}</h1><p>{course.description}</p>{url?<Button href={url} external>Quero me inscrever</Button>:<><Button disabled describedBy="enrollment-status">Quero me inscrever</Button><p id="enrollment-status" className="enrollment-note">Inscrições ainda não disponíveis. Novidades em breve.</p></>}</div></div></Container></section>;}
