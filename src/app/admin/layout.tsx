import Image from 'next/image';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 font-sans selection:bg-[#5C4FFF] selection:text-white">
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shadow-xs overflow-hidden p-1">
                <Image
                  src="/koyitech-mark.png"
                  alt="Koyitech Africa"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg text-[#181059] leading-tight">
                  Admin Dashboard
                </span>
                <span className="text-[11px] font-semibold text-slate-400 hidden sm:block leading-tight">
                  Computer &amp; IT Fundamentals &bull; Cohort I
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/admin"
                className="text-sm font-bold text-slate-600 hover:text-[#5C4FFF] px-3 py-2 rounded-lg hover:bg-slate-100/70 transition-all"
              >
                Enrolled
              </Link>
              <Link
                href="/admin/broadcast"
                className="text-sm font-bold text-white bg-[#5C4FFF] px-4 py-2 rounded-xl hover:bg-[#4b40e6] shadow-sm transition-all"
              >
                Broadcast
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">{children}</main>
    </div>
  );
}
