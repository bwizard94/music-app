import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import FeaturedArtists from '@/components/sections/FeaturedArtists';
import FeaturedEvents from '@/components/sections/FeaturedEvents';
import FeaturedVenues from '@/components/sections/FeaturedVenues';
import HowItWorks from '@/components/sections/HowItWorks';
import LocalScenes from '@/components/sections/LocalScenes';
import Stats from '@/components/sections/Stats';
import CreativeRoles from '@/components/sections/CreativeRoles';
import Testimonials from '@/components/sections/Testimonials';
import FinalCTA from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <main className="bg-[#060608] min-h-screen">
      <Navigation />
      <Hero />
      <Marquee />
      <FeaturedArtists />
      <FeaturedEvents />
      <HowItWorks />
      <FeaturedVenues />
      <Stats />
      <LocalScenes />
      <CreativeRoles />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
