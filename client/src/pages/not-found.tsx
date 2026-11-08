import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { usePageMeta } from "@/lib/seo";

export default function NotFound() {
  usePageMeta("/404");
  return (
    <>
      <Navigation />
      <main className="kraft-texture flex min-h-[80vh] items-center justify-center bg-paper px-4 pt-20 text-center">
        <div>
          <p className="display text-[clamp(6rem,20vw,14rem)] text-kraft">404</p>
          <h1 className="display -mt-4 text-4xl">Lost the paper?</h1>
          <p className="mt-4 text-ink-soft">This page went up in smoke.</p>
          <a href="/" className="btn btn-ink mt-8">Back home</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
