import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Menu, Phone, X } from "lucide-react";
import logoUrl from "@/assets/rtl-logo.png";

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "py-2.5" : "py-5",
      )}
    >
      <div className={cn(
        "mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 transition-all",
        scrolled && "max-w-6xl",
      )}>
        <Link to="/" className="flex items-center gap-2.5 group" aria-label={SITE.name}>
          <img
            src={logoUrl}
            alt="Rony Tech Labs"
            width={36}
            height={36}
            className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105"
          />
          <span className="font-display text-base font-semibold tracking-tight hidden sm:inline">
            Rony Tech<span className="text-gradient"> Labs</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center glass rounded-full px-1.5 py-1.5">
          {NAV_LINKS.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative px-4 py-1.5 text-sm rounded-full transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && <span className="absolute inset-0 rounded-full bg-gradient-brand opacity-10" />}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="group relative inline-flex items-center gap-2 text-xs font-mono pl-1.5 pr-3.5 py-1.5 rounded-full glass overflow-hidden hover:scale-[1.02] transition-transform"
            aria-label={`Call ${SITE.phone}`}
          >
            <span className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-20 transition-opacity" />
            <span className="relative h-6 w-6 grid place-items-center rounded-full bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--teal))] text-white">
              <span className="absolute inset-0 rounded-full bg-[hsl(var(--electric))] animate-ping opacity-40" />
              <Phone className="h-3 w-3 relative" />
            </span>
            <span className="relative tracking-wider">
              <span className="text-muted-foreground">+91</span>{" "}
              <span className="text-foreground">{SITE.phone}</span>
            </span>
          </a>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden glass rounded-full p-2.5"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-4 mt-3 glass-strong rounded-2xl p-2 flex flex-col">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-3 text-sm rounded-xl hover:bg-secondary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="px-4 py-3 text-sm rounded-xl text-muted-foreground inline-flex items-center gap-2"
          >
            <Phone className="h-3.5 w-3.5" /> {SITE.phone}
          </a>
        </div>
      )}
    </header>
  );
}
