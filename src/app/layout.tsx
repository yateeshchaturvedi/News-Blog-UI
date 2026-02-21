import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { logout } from "@/app/actions";
import { getSiteUrl } from "@/lib/seo";
import PublicAdSlot from "@/components/PublicAdSlot";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "DevOpsTic Academy - Learn DevOps by Building",
    template: "%s | DevOpsTic Academy",
  },
  description: "Hands-on DevOps learning with practical guides on CI/CD, Kubernetes, cloud, IaC, and observability.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DevOpsTic Academy",
    title: "DevOpsTic Academy - Learn DevOps by Building",
    description: "Hands-on DevOps learning with practical guides on CI/CD, Kubernetes, cloud, IaC, and observability.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOpsTic Academy - Learn DevOps by Building",
    description: "Hands-on DevOps learning with practical guides on CI/CD, Kubernetes, cloud, IaC, and observability.",
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
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        {token && (
          <div className="border-b border-blue-100 bg-white/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1240px] items-center justify-end gap-3 px-4 py-2 md:px-6">
              <Link
                href="/admin/dashboard"
                className="rounded-full border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                {dashboardLabel}
              </Link>
              <form action={handleLogout}>
                <button
                  type="submit"
                  className="rounded-full border border-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        )}
        <Header />
        <main className="mx-auto w-full max-w-[1240px] px-4 py-8 md:px-6 md:py-10">{children}</main>
        <section className="mx-auto w-full max-w-[1240px] px-4 pb-8 md:px-6">
          <PublicAdSlot placement="site-footer" title="Sponsored" />
        </section>
        <Footer />
      </body>
    </html>
  );
}
