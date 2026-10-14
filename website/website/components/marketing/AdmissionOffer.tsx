import Image from 'next/image';
import Link from 'next/link';
import { getWhatsAppLink } from '@/constants';
import { MARKETING_IMAGES } from '@/lib/marketingAssets';

const AdmissionOffer = () => {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-ink">
          <Image
            src={MARKETING_IMAGES.jobs}
            alt="Candidates preparing for IT interviews"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 560px, 100vw"
          />
        </div>
        <div>
          <p className="section-title">Internship and admissions</p>
          <h2 className="heading-display text-3xl sm:text-4xl">Train on a live project, then sit for an IT role</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Classroom, online, and internship tracks share the same placement desk. We introduce you to hiring partners
            for developer, consultant, data, and cloud roles, with packages up to 30 LPA.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/internship" className="btn-primary">
              See the internship
            </Link>
            <a
              href={getWhatsAppLink('Hi Softivox Tech, I want details on the internship and the next admission batch.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionOffer;
