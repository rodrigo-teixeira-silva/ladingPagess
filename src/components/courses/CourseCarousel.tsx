'use client';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseCard } from './CourseCard';
import type { Course } from '@/types/course';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
export function CourseCarousel({ courses }: { courses: Course[] }) {
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  // Presentation-only repetitions let the three-card catalog rotate continuously.
  // No course is added to the catalog. Offscreen slides are hidden from keyboard/AT.
  const slides = courses.length === 3 ? [...courses, ...courses] : courses;
  const [ref, api] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1, duration: reduced ? 0 : 28 });
  const [interaction, setInteraction] = useState(0);
  const restart = useCallback(() => setInteraction(value => value + 1), []);
  const [navigation, setNavigation] = useState({ selected: 0, snaps: 0, previous: false, next: false, visible: [] as number[] });
  const update = useCallback(() => {
    if (!api) return;
    setNavigation({ selected: api.selectedScrollSnap(), snaps: api.scrollSnapList().length, previous: api.canScrollPrev(), next: api.canScrollNext(), visible: api.slidesInView() });
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const frame = requestAnimationFrame(update);
    api.on('select', update).on('reInit', update).on('slidesInView', update).on('pointerUp', restart);
    return () => { cancelAnimationFrame(frame); api.off('select', update).off('reInit', update).off('slidesInView', update).off('pointerUp', restart); };
  }, [api, update, restart]);
  const movable = navigation.snaps > 1 && (navigation.previous || navigation.next);
  useEffect(() => {
    if (!api || reduced || !movable) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (api.canScrollNext()) api.scrollNext(); else api.scrollTo(0);
    }, 5000);
    return () => clearInterval(timer);
  }, [api, reduced, movable, interaction]);
  if (!courses.length) return <p>Nenhum curso em destaque no momento.</p>;
  const dotCount = Math.min(courses.length, navigation.snaps);
  return <div className="carousel" role="region" aria-roledescription="carrossel" aria-label="Cursos em destaque">
    <div className="carousel-viewport" ref={ref}><div className="carousel-track">
      {slides.map((course, i) => {
        const hidden = navigation.visible.length > 0 && !navigation.visible.includes(i);
        return <div className="carousel-slide" role="group" aria-roledescription="slide" aria-label={`${i % courses.length + 1} de ${courses.length}`} aria-hidden={hidden || undefined} inert={hidden || undefined} key={`${course.id}-${i}`}><CourseCard course={course}/></div>;
      })}
    </div></div>
    <div className="carousel-controls"><div className="carousel-dots">{Array.from({ length: dotCount }, (_, i) => <button key={i} className={navigation.selected % courses.length === i ? 'is-selected' : ''} onClick={() => { api?.scrollTo(i, reduced); restart(); }} aria-label={`Ir para o grupo ${i + 1}`} aria-current={navigation.selected % courses.length === i ? 'true' : undefined} disabled={!movable}/>)}</div>
      <div className="carousel-arrows">
        <button className="icon-button carousel-previous" aria-label="Cursos anteriores" disabled={!navigation.previous} onClick={() => { api?.scrollPrev(reduced); restart(); }}><ChevronLeft size={26}/></button>
        <button className="icon-button carousel-next" aria-label="Próximos cursos" disabled={!navigation.next} onClick={() => { api?.scrollNext(reduced); restart(); }}><ChevronRight size={26}/></button>
      </div>
    </div>
  </div>;
}
