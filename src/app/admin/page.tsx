import EnrolledStudentsTable from '@/components/EnrolledStudentsTable';
import { getEnrolledStudents } from '@/lib/enrolledStudents';

// Force dynamic rendering so every new student signup appears immediately
export const dynamic = 'force-dynamic';

export default async function AdminEnrolledPage() {
  const { students, errorMsg } = await getEnrolledStudents();
  const totalEnrolled = students.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Summary Card */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5C4FFF]/10 px-3 py-1 text-xs font-extrabold text-[#5C4FFF] uppercase tracking-wider mb-2">
            Cohort I &bull; 100% Free Training
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#181059] tracking-tight">
            Computer &amp; IT Fundamentals &mdash; Enrolled
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Complete signup details for all students enrolled in Koyitech Africa&apos;s Free Computer &amp; IT Fundamentals training.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white shadow-[0_4px_20px_rgba(24,16,89,0.05)] border border-slate-200/90 rounded-2xl px-6 py-3.5 flex flex-col items-center justify-center min-w-[160px]">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
              Total Enrolled
            </span>
            <span className="text-3xl font-black text-[#5C4FFF] tabular-nums">{totalEnrolled}</span>
          </div>
        </div>
      </div>

      {errorMsg ? (
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 p-4 rounded-xl">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-semibold">{errorMsg}</p>
            </div>
          </div>
        </div>
      ) : (
        <EnrolledStudentsTable students={students} />
      )}
    </div>
  );
}
