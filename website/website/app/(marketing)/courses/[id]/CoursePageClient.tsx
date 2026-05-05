'use client';

import { useParams } from 'next/navigation';
import CourseDetail from '@/components/marketing/CourseDetail';
import ContactForm from '@/components/marketing/ContactForm';

export default function CoursePageClient() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  return (
    <>
      <CourseDetail courseId={id} />
      <ContactForm />
    </>
  );
}
