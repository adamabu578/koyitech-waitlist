import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering so it always fetches the latest data
export const dynamic = 'force-dynamic';

export default async function AdminWaitlistPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let subscribers: any[] = [];
  let errorMsg = null;
  let totalCount = 0;

  if (!supabaseUrl || !supabaseKey) {
    errorMsg = "Supabase credentials are not configured in .env.local";
  } else {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch data and count
      const { data, error, count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          errorMsg = "The 'waitlist' table does not exist in your Supabase database yet.";
        } else {
          errorMsg = `Failed to fetch subscribers: ${error.message}`;
        }
      } else {
        subscribers = data || [];
        totalCount = count || subscribers.length;
      }
    } catch (err: any) {
      errorMsg = `Unexpected error: ${err.message}`;
    }
  }

  // Formatting date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
            Waitlist Subscribers
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            A list of all users who have joined the Koyitech Africa waitlist.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl px-5 py-3 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Subscribers</span>
            <span className="text-3xl font-black text-[#5C4FFF]">{totalCount}</span>
          </div>
        </div>
      </div>

      {errorMsg ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                {errorMsg}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No subscribers yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                When people join the waitlist, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Phone Number
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Date Joined
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subscribers.map((subscriber, idx) => (
                    <tr key={subscriber.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {subscriber.name || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {subscriber.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {subscriber.phone || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(subscriber.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
