import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Wordmark, WhatsAppIcon } from "./brand";
import { WHATSAPP_URL } from "@/lib/contact";
import { CartButton } from "./cart";

const links = [
  { href: "/#shop", label: "Shop" },
  { href: "/#pack", label: "The Pack" },
  { href: "/guides", label: "Guides" },
  { href: "/what-the-fun", label: "What The Fun" },
  { href: "/#buy", label: "Buy" },
  { href: "/#contact", label: "Contact" },
];

export default function Navigation({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open || solid ? "bg-paper/90 shadow-[0_1px_0_rgba(22,18,14,.12)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        <Link href="/" className="text-ink" aria-label="Jotah home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-soft transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ink !px-5 !py-2.5 text-sm" data-testid="nav-whatsapp">
            <WhatsAppIcon className="h-4 w-4" /> Chat with us
          </a>
          <CartButton className="-ml-3" />
        </div>

        <div className="flex items-center gap-1 md:hidden">
        <CartButton />
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-2 text-ink"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[color:var(--border)] px-4 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="animate-slide-in block border-b border-[color:var(--border)] py-4 font-display text-2xl font-extrabold"
            >
              {l.label}
            </a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-6 w-full">
            <WhatsAppIcon /> WhatsApp “What The Fun”
          </a>
        </div>
      )}
    </header>
  );
}
