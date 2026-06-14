import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyImportant from '../components/WhyImportant';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <WhyImportant />
      <HowItWorks />
      <Benefits />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
