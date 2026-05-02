import { Link } from "@tanstack/react-router";
import { SITE, NAV_LINKS } from "@/lib/site";
import logoUrl from "@/assets/rtl-logo.png";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="absolute inset-x-0 top-0 h-px divider-soft" />
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src={logoUrl} alt="Rony Tech Labs" width={32} height={32} className="h-8 w-8" />
            <span className="font-display text-base font-semibold tracking-tight">
              Rony Tech<span className="text-gradient"> Labs</span>
            </span>
          </Link>
          <div className="mt-6 font-display text-3xl md:text-4xl tracking-tight leading-[1.05]">
            Let's build something <span className="text-gradient">unforgettable</span>.
          </div>
          <p className="mt-4 text-muted-foreground max-w-md text-sm leading-relaxed">
            We partner with founders and teams shipping the next wave of digital products.
            Web, AI, mobile, software — engineered for scale.
          </p>
          <div className="mt-8 flex items-center gap-6 text-sm">
            <a href={`tel:${SITE.phone.replace(/\s/g,"")}`} className="font-mono hover:text-primary transition-colors">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors">{SITE.email}</a>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Explore</div>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-primary transition-colors text-foreground/80">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Studio</div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            A digital innovation lab building polished, production-grade products.
            From immersive marketing sites to AI copilots powering teams of hundreds.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
          <div className="font-mono">v2.0 — Premium Light</div>
        </div>
      </div>
    </footer>
  );
}
