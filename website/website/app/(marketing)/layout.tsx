import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import AIChatAssistant from '@/components/marketing/AIChatAssistant';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar isHrmContext={false} />
      <main>{children}</main>
      <Footer />
      <AIChatAssistant />
    </>
  );
}
