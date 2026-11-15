'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { EnrolledStudent } from '@/lib/enrolledStudents';

interface EnrolledStudentsTableProps {
  students: EnrolledStudent[];
}

function getInitials(name: string, email: string) {
  const source = (name || email || '?').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function formatDateParts(dateString?: string) {
  if (!dateString) return { date: 'Unknown date', time: '' };
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return { date: 'Unknown date', time: '' };

  return {
    date: d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function escapeCsvCell(value: string | number | boolean) {
  const str = String(value ?? '');
  return `"${str.replace(/"/g, '""')}"`;
}

export default function EnrolledStudentsTable({ students }: EnrolledStudentsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isRefreshing, startTransition] = useTransition();

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
    );
  }, [students, search]);

  const handleExportCsv = () => {
    const rowsToExport = filteredStudents;
    const headers = [
      'S/N',
      'Full Name',
      'Email Address',
      'Phone Number',
      'Course',
      'Cohort',
      'Status',
      'Classroom Account',
      'Date Enrolled',
    ];

    const csvLines = [
      headers.map(escapeCsvCell).join(','),
      ...rowsToExport.map((s, idx) => {
        const { date, time } = formatDateParts(s.created_at);
        const formattedDate = time ? `${date} ${time}` : date;
        return [
          idx + 1,
          s.name || s.email.split('@')[0],
          s.email,
          s.phone || '',
          s.course || 'Computer & IT Fundamentals',
          s.cohort || 'Cohort I',
          'Enrolled',
          s.lmsSynced ? 'Active' : 'Registered',
          formattedDate,
        ]
          .map(escapeCsvCell)
          .join(',');
      }),
    ];

    // Prepend UTF-8 BOM so Excel opens names and columns cleanly
    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `koyitech-computer-it-fundamentals-enrolled-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(24,16,89,0.05)] rounded-2xl overflow-hidden">
      {/* Toolbar: Search + Refresh + CSV Export */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#5C4FFF] focus:ring-2 focus:ring-[#5C4FFF]/15 outline-none transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-60"
          >
            <svg
              className={`h-4 w-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredStudents.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-[#181059] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#24197a] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table or Empty State */}
      {students.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5C4FFF]/10 mb-4">
            <svg className="w-8 h-8 text-[#5C4FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No enrolled students yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            When students sign up for Cohort I (Computer &amp; IT Fundamentals), all of their signup details will appear here automatically.
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-sm font-semibold text-slate-700">
            No enrolled students match &ldquo;{search}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-2 text-xs font-bold text-[#5C4FFF] hover:underline"
          >
            Clear search filter
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80">
            <thead className="bg-slate-50/90">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-2 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider sm:pl-6 w-12"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Email Address
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Program / Track
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Date Enrolled
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-3 pr-4 sm:pr-6 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.map((student, idx) => {
                const displayName = student.name || student.email.split('@')[0];
                const initials = getInitials(student.name, student.email);
                const { date, time } = formatDateParts(student.created_at);

                return (
                  <tr
                    key={student.id || student.email || idx}
                    className="hover:bg-[#5C4FFF]/[0.03] transition-colors group"
                  >
                    <td className="whitespace-nowrap py-3.5 pl-4 pr-2 text-xs font-bold text-slate-400 sm:pl-6 tabular-nums">
                      {idx + 1}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-white text-[#5C4FFF] border-2 border-[#5C4FFF]/30 flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 capitalize">
                            {displayName}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400">
                            {student.cohort} &bull; Free Training
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-sm text-slate-600 font-medium">
                      <a
                        href={`mailto:${student.email}`}
                        className="hover:text-[#5C4FFF] transition-colors"
                      >
                        {student.email}
                      </a>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-sm tabular-nums">
                      {student.phone ? (
                        <a
                          href={`tel:${student.phone}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100/80 hover:bg-[#5C4FFF]/10 hover:text-[#5C4FFF] px-2.5 py-1 rounded-lg transition-colors text-xs"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {student.phone}
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not provided</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span className="inline-flex items-center rounded-lg bg-[#5C4FFF]/10 px-2.5 py-1 text-xs font-bold text-[#5C4FFF]">
                        {student.course}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="text-xs sm:text-sm font-semibold text-slate-700">{date}</div>
                      {time && <div className="text-[11px] text-slate-400">{time}</div>}
                    </td>

                    <td className="whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Enrolled
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer summary */}
      {students.length > 0 && (
        <div className="px-4 sm:px-6 py-3 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="font-bold text-slate-800">{filteredStudents.length}</strong> of{' '}
            <strong className="font-bold text-slate-800">{students.length}</strong> enrolled{' '}
            {students.length === 1 ? 'student' : 'students'}
          </span>
          <span className="text-slate-400">
            Program: <strong className="text-slate-600">Computer &amp; IT Fundamentals (Cohort I)</strong>
          </span>
        </div>
      )}
    </div>
  );
}
