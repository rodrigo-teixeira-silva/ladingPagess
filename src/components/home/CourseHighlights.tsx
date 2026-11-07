import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CourseCarousel } from '@/components/courses/CourseCarousel';
import { featuredCourses } from '@/data/courses';
export function CourseHighlights(){return <section id="cursos" className="courses-section section-space"><Container><SectionHeading title="Cursos em Destaque"/><CourseCarousel courses={featuredCourses}/></Container></section>;}
