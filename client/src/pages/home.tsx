import Navigation from "@/components/navigation";
import { Contact, Faq, GuidesTeaser, Hero, InstagramStrip, Lookbook, Marquee, PackGallery, PlaySection, Shop, Specs, Story, WhereToBuy, WtfBand } from "@/components/home-sections";
import { Footer } from "@/components/site-chrome";
import { usePageMeta } from "@/lib/seo";
import { TornEdge } from "@/components/brand";

const KRAFT = "#D9AE7E";
const INK = "#16120E";

export default function Home() {
  usePageMeta("/");
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <Story />
        <TornEdge fill={INK} bg="bg-paper" />
        <Lookbook />
        <TornEdge fill={KRAFT} bg="bg-ink" />
        <Specs />
        <TornEdge fill={KRAFT} bg="bg-paper-2" flip />
        <Shop />
        <PackGallery />
        <TornEdge fill={INK} bg="bg-paper" />
        <WtfBand />
        <PlaySection />
        <TornEdge fill={INK} bg="bg-paper-2" flip />
        <WhereToBuy />
        <GuidesTeaser />
        <InstagramStrip />
        <Faq />
        <TornEdge fill={KRAFT} bg="bg-paper" />
        <Contact />
        <TornEdge fill={KRAFT} bg="bg-ink" flip />
      </main>
      <Footer />
    </>
  );
}
