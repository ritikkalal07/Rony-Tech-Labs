import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-8xl tracking-tighter text-gradient">404</div>
        <h2 className="mt-4 text-xl font-semibold">Lost in the void</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist — yet. Let's get you back to something real.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rony Tech Labs - We Build Digital Worlds" },
      { name: "description", content: "An innovative lab dedicated to creating web, AI, mobile, and software solutions that enhance performance metrics and drive measurable results." },
      { name: "author", content: "Rony Tech Labs" },
      { property: "og:title", content: "Rony Tech Labs - We Build Digital Worlds" },
      { property: "og:description", content: "An innovative lab dedicated to creating web, AI, mobile, and software solutions that enhance performance metrics and drive measurable results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rony Tech Labs - We Build Digital Worlds" },
      { name: "twitter:description", content: "An innovative lab dedicated to creating web, AI, mobile, and software solutions that enhance performance metrics and drive measurable results." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b2fe3619-0e0a-4144-b6b7-bcbe8efbcfd9/id-preview-f0f3031c--a762ca6f-9477-4fa4-86c6-e8bbd9273e2e.lovable.app-1777706963867.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b2fe3619-0e0a-4144-b6b7-bcbe8efbcfd9/id-preview-f0f3031c--a762ca6f-9477-4fa4-86c6-e8bbd9273e2e.lovable.app-1777706963867.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryProvider>
      <SmoothScroll />
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <SiteHeader />}
      <main className="relative">
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      {!isAdmin && <ChatbotWidget />}
      <Toaster theme="dark" position="bottom-center" />
    </QueryProvider>
  );
}
