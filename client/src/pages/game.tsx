import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import StackGame from "@/components/stack-game";
import { usePageMeta } from "@/lib/seo";

export default function Game() {
  usePageMeta("/game");
  return (
    <>
      <Navigation solid />
      <main className="bg-ink pb-20 pt-24 text-paper md:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div className="lg:order-2"><StackGame autoFocus /></div>
          <div className="lg:order-1 lg:max-w-md">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-paper/50">What The Fun · Game</p>
            <h1 className="display text-[clamp(2.8rem,6vw,5rem)]">Stack the Packs.</h1>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              Drop each Jotah pack right on top of the last. Whatever hangs over falls off — so aim well.
              Land three <strong className="text-paper">perfect</strong> drops in a row and your pack grows back.
            </p>
            <ul className="mt-8 space-y-3 text-paper/75">
              <li>👆 <strong className="text-paper">Tap</strong> the game (or press <kbd className="rounded bg-paper/10 px-1.5 py-0.5 text-sm">Space</kbd>) to drop</li>
              <li>🎯 Perfect drop = sparks + combo bonus</li>
              <li>🌙 Climb high and the sky turns to night</li>
              <li>🏆 Beat your best line, then challenge a friend on WhatsApp</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
