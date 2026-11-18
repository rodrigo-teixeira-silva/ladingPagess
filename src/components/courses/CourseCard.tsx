// src/components/courses/CourseCard.tsx
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/types/course";

export function CourseCard({ course }: { course: Course }) {
  // Define o link: se tiver enrollmentUrl, usa ele. Senão, usa a rota interna.
  const actionHref = course.enrollmentUrl || `/cursos/${course.slug}`;
  const isExternal = !!course.enrollmentUrl;

  return (
    <article className="course-card">
      <div className="course-cover">
        <Image
          src={course.image || "/assets/placeholder-course.jpg"} // Fallback de segurança
          alt={`Capa do curso ${course.title}`}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 420px"
          className="object-cover"
        />
      </div>
      
      <div className="course-body">
        <h3>{course.title}</h3>
        <p>{course.shortDescription}</p>
        
        {isExternal ? (
          // Aqui estava o erro: removemos o target e rel, 
          // pois o seu próprio componente Button já cuida disso via prop 'external'
          <Button href={actionHref} external>
            Inscreva-se
          </Button>
        ) : (
          <Button href={actionHref}>
            Ver mais
          </Button>
        )}
      </div>
    </article>
  );
}