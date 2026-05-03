"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PublicLayoutWrapper({ 
  children,
  adSlot1,
  adSlot2
}: { 
  children: React.ReactNode;
  adSlot1?: React.ReactNode;
  adSlot2?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-[1440px] items-start gap-8 px-4 py-8 md:px-6 md:py-10">
        <main className="min-w-0 flex-1">{children}</main>
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-28 space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Sponsored Content</h3>
              <div className="space-y-6">
                {adSlot1}
                {adSlot2}
              </div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </>
  );
}
