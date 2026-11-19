import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseCarousel } from "@/components/courses/CourseCarousel";
import { AdminCourseToolbar } from "@/components/admin/AdminCourseToolbar";
import { getPublicCatalog } from "@/lib/publicCourses";

export async function CourseHighlights() {
  const { courses, source } = await getPublicCatalog();
  const featured = courses.filter((course) => course.featured);

  return (
    <section id="cursos" className="courses-section section-space">
      <Container>
        <SectionHeading title="Cursos em Destaque" />
        <AdminCourseToolbar source={source} />
        <CourseCarousel courses={featured} />
      </Container>
    </section>
  );
}
