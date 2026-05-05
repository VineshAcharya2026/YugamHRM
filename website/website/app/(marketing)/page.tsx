import Hero from '@/components/marketing/Hero';
import Welcome from '@/components/marketing/Welcome';
import Services from '@/components/marketing/Services';
import IntegrationsStrip from '@/components/marketing/IntegrationsStrip';
import FeatureShowcase from '@/components/marketing/FeatureShowcase';
import Testimonials from '@/components/marketing/Testimonials';
import Stats from '@/components/marketing/Stats';
import HrmCandidateIntake from '@/components/marketing/HrmCandidateIntake';
import ContactForm from '@/components/marketing/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Welcome />
      <Services />
      <IntegrationsStrip />
      <FeatureShowcase />
      <Testimonials />
      <Stats />
      <HrmCandidateIntake />
      <ContactForm />
    </>
  );
}
