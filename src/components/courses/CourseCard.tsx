import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { Course } from '@/types/course';
export function CourseCard({course}:{course:Course}){return <article className="course-card"><div className="course-cover"><Image src={course.image} alt={`Capa do curso ${course.title}`} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 420px"/></div><div className="course-body"><h3>{course.title}</h3><p>{course.shortDescription}</p><Button href={`/cursos/${course.slug}`}>Ver mais</Button></div></article>;}
