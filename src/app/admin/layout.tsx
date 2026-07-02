import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#5C4FFF] selection:text-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#181059] flex items-center justify-center text-white font-black">
                K
              </div>
              <span className="font-bold text-lg text-[#181059]">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-[#5C4FFF] transition-colors">
                Subscribers
              </Link>
              <Link href="/admin/broadcast" className="text-sm font-medium text-white bg-[#5C4FFF] px-4 py-2 rounded-lg hover:bg-[#4b40e6] shadow-sm transition-all">
                Broadcast
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}
