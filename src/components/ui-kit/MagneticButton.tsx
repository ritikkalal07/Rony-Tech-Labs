import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
};

export function MagneticButton({ children, className, variant = "primary", ...props }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 will-change-transform disabled:opacity-50 disabled:pointer-events-none";
  const styles = {
    primary:
      "bg-gradient-brand text-white shadow-[0_8px_24px_-8px_hsl(var(--electric)/0.5)] hover:shadow-[0_16px_40px_-12px_hsl(var(--electric)/0.6)]",
    outline:
      "border border-border bg-white/70 text-foreground hover:bg-white backdrop-blur glow-ring",
    ghost: "text-foreground/80 hover:text-primary",
  } as const;

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(base, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
