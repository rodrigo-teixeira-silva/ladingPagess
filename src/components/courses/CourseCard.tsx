"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { EditCourseButton } from "@/components/admin/EditCourseButton";
import type { Course } from "@/types/course";

export function CourseCard({ course }: { course: Course }) {
  // "Ver mais" sempre leva à página do curso; o link de inscrição fica no botão "Quero me inscrever" de lá.
  return (
    <article className="course-card">
      <div className="course-cover">
        {course.image && (
          <Image
            src={course.image}
            alt={`Capa do curso ${course.title}`}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 420px"
            className="object-cover"
          />
        )}
        <EditCourseButton course={course} className="course-admin-edit" />
      </div>

      <div className="course-body">
        <h3>{course.title}</h3>
        <p>{course.shortDescription}</p>

        <Button href={`/cursos/${course.slug}`}>Ver mais</Button>
      </div>
    </article>
  );
}
