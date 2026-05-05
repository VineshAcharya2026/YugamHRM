import CoursePageClient from './CoursePageClient';
import { COURSE_SLUGS } from '@/lib/courseSlugs';

export function generateStaticParams() {
  return COURSE_SLUGS.map((id) => ({ id }));
}

export default function CoursePage() {
  return <CoursePageClient />;
}
