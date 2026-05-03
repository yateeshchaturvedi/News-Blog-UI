import type { Metadata } from "next";
import { Sora, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/app/actions";
import { getSiteUrl } from "@/lib/seo";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import CookieConsent from "@/components/CookieConsent";
import PublicAdSlot from "@/components/PublicAdSlot";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Devopstick - Master the Art of DevOps",
    template: "%s | Devopstick",
  },
  description: "The comprehensive learning platform for modern engineers. Master Linux, Docker, Kubernetes, and Cloud through production-ready curriculum.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Devopstick",
    title: "Devopstick - Master the Art of DevOps",
    description: "The comprehensive learning platform for modern engineers. Master Linux, Docker, Kubernetes, and Cloud through production-ready curriculum.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devopstick - Master the Art of DevOps",
    description: "The comprehensive learning platform for modern engineers. Master Linux, Docker, Kubernetes, and Cloud through production-ready curriculum.",
  },
};

interface JwtPayload {
  user?: {
    role?: number;
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  async function handleLogout() {
    "use server";
    await logout();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let role: number | undefined;
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      role = decoded.user?.role;
    } catch {
      role = undefined;
    }
  }

  const dashboardLabel =
    role === 1 ? "Admin Dashboard" : role === 2 ? "Editor Dashboard" : "Dashboard";

  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(59,130,246,0.14),transparent_70%)]" />
          {token && (
            <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-[1240px] items-center justify-end gap-3 px-4 py-2 md:px-6">
                <Link
                  href="/admin/dashboard"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {dashboardLabel}
                </Link>
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          )}
          <PublicLayoutWrapper
            adSlot1={<PublicAdSlot placement="global-sidebar-1" title="Partner" compact />}
            adSlot2={<PublicAdSlot placement="global-sidebar-2" title="Featured" compact />}
          >
            {children}
          </PublicLayoutWrapper>
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
