import Hero from '@/components/marketing/Hero';
import Stats from '@/components/marketing/Stats';
import Services from '@/components/marketing/Services';
import FeaturedPrograms from '@/components/marketing/FeaturedPrograms';
import WhyChooseUs from '@/components/marketing/WhyChooseUs';
import Placements from '@/components/marketing/Placements';
import FAQ from '@/components/marketing/FAQ';
import AdmissionOffer from '@/components/marketing/AdmissionOffer';
import ContactForm from '@/components/marketing/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <FeaturedPrograms />
      <WhyChooseUs />
      <Placements />
      <FAQ />
      <AdmissionOffer />
      <ContactForm />
    </>
  );
}
