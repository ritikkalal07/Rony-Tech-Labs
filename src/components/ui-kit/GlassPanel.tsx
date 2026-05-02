import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
  strong,
  tint,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; strong?: boolean; tint?: boolean }) {
  return (
    <div
      className={cn(
        tint ? "glass-tint" : strong ? "glass-strong" : "glass",
        "rounded-2xl",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
