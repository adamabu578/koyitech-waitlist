import { createClient } from '@supabase/supabase-js';

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  cohort: string;
  status: string;
  lmsSynced: boolean;
  created_at: string;
}

const DEFAULT_COURSE = 'Computer & IT Fundamentals';
const DEFAULT_COHORT = 'Cohort I';
const COURSE_MATCH_KEY = 'computer & it fundamentals';

const DEFAULT_LMS_SUPABASE_URL = 'https://tvlzkkrewfoksgdmccpr.supabase.co';
const DEFAULT_LMS_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bHpra3Jld2Zva3NnZG1jY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDczNjksImV4cCI6MjA5MjgyMzM2OX0.Uxoc4O_aaReAWjKgnNPXc28UuZwqHHrGX5NZoGija-s';

export function getLmsSupabaseConfig() {
  return {
    lmsUrl:
      process.env.LMS_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_LMS_SUPABASE_URL ||
      DEFAULT_LMS_SUPABASE_URL,
    lmsAnonKey:
      process.env.LMS_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_LMS_SUPABASE_ANON_KEY ||
      DEFAULT_LMS_SUPABASE_ANON_KEY,
  };
}

function isFreeTrainingCourse(value?: string | null): boolean {
  return Boolean(value && value.toLowerCase().includes(COURSE_MATCH_KEY));
}

export async function recordStudentInWaitlistDb({
  email,
  name,
  phone,
}: {
  email: string;
  name: string;
  phone?: string;
}) {
  const waitlistUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const waitlistServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const waitlistKey = waitlistServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!waitlistUrl || !waitlistKey) return;

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(name || '').trim();
  const cleanPhone = String(phone || '').trim();

  const supabase = createClient(waitlistUrl, waitlistKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (waitlistServiceKey) {
    // Tag enrollment in waitlist project's Auth metadata so Cohort I enrollees are strictly distinguished from old waitlist entries
    try {
      const { data: listData } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      const existingAuthUser = listData?.users?.find(
        (u) => u.email?.toLowerCase() === cleanEmail
      );

      if (existingAuthUser) {
        await supabase.auth.admin.updateUserById(existingAuthUser.id, {
          user_metadata: {
            ...existingAuthUser.user_metadata,
            full_name: cleanName || existingAuthUser.user_metadata?.full_name || '',
            phone: cleanPhone || existingAuthUser.user_metadata?.phone || '',
            subjects: DEFAULT_COURSE,
            cohort: `${DEFAULT_COHORT} — ${DEFAULT_COURSE}`,
          },
        });
      } else {
        await supabase.auth.admin.createUser({
          email: cleanEmail,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            phone: cleanPhone,
            subjects: DEFAULT_COURSE,
            cohort: `${DEFAULT_COHORT} — ${DEFAULT_COURSE}`,
          },
        });
      }
    } catch {
      // Non-blocking backup tag
    }

    const { data: existing, error: selectError } = await supabase
      .from('waitlist')
      .select('id, name, phone')
      .ilike('email', cleanEmail)
      .limit(1);

    if (!selectError && existing && existing.length > 0) {
      const row = existing[0];
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({
          name: cleanName || row.name || '',
          phone: cleanPhone || row.phone || '',
        })
        .eq('id', row.id);

      if (updateError) {
        console.error('Waitlist DB update warning:', updateError.message);
      }
      return;
    }
  }

  const { error: insertError } = await supabase
    .from('waitlist')
    .insert([{ email: cleanEmail, name: cleanName, phone: cleanPhone }]);

  if (insertError && insertError.code !== '23505') {
    console.error('Waitlist DB insert warning:', insertError.message, insertError.details);
  }
}

export async function getEnrolledStudents(): Promise<{
  students: EnrolledStudent[];
  errorMsg: string | null;
}> {
  const waitlistUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const waitlistServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const waitlistKey = waitlistServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { lmsUrl, lmsAnonKey } = getLmsSupabaseConfig();

  if ((!waitlistUrl || !waitlistKey) && (!lmsUrl || !lmsAnonKey)) {
    return {
      students: [],
      errorMsg: 'Supabase credentials are not configured in .env.local',
    };
  }

  const byEmail = new Map<string, EnrolledStudent>();
  const errors: string[] = [];

  const mergeStudent = (incoming: Partial<EnrolledStudent> & { email: string }) => {
    const normalizedEmail = incoming.email.trim().toLowerCase();
    if (!normalizedEmail) return;

    const existing = byEmail.get(normalizedEmail);
    if (!existing) {
      byEmail.set(normalizedEmail, {
        id: incoming.id || normalizedEmail,
        name: (incoming.name || '').trim(),
        email: normalizedEmail,
        phone: (incoming.phone || '').trim(),
        course: DEFAULT_COURSE,
        cohort: incoming.cohort || DEFAULT_COHORT,
        status: incoming.status || 'Enrolled',
        lmsSynced: Boolean(incoming.lmsSynced),
        created_at: incoming.created_at || new Date().toISOString(),
      });
      return;
    }

    const incomingName = (incoming.name || '').trim();
    const chosenName =
      incomingName.length > existing.name.length ? incomingName : existing.name || incomingName;

    const incomingPhone = (incoming.phone || '').trim();
    const chosenPhone = existing.phone || incomingPhone;

    const existingTime = Date.parse(existing.created_at || '') || 0;
    const incomingTime = Date.parse(incoming.created_at || '') || 0;
    const chosenDate =
      incomingTime > existingTime && incoming.created_at
        ? incoming.created_at
        : existing.created_at || incoming.created_at || new Date().toISOString();

    byEmail.set(normalizedEmail, {
      ...existing,
      id: existing.id || incoming.id || normalizedEmail,
      name: chosenName,
      phone: chosenPhone,
      course: DEFAULT_COURSE,
      lmsSynced: existing.lmsSynced || Boolean(incoming.lmsSynced),
      status: 'Enrolled',
      created_at: chosenDate,
    });
  };

  // 1. Fetch ONLY students enrolled in "Computer & IT Fundamentals" from Koyitech Africa LMS (`public.profiles`)
  if (lmsUrl && lmsAnonKey) {
    try {
      const lmsSupabase = createClient(lmsUrl, lmsAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data: lmsProfiles, error: lmsError } = await lmsSupabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, status, subjects, created_at')
        .ilike('subjects', '%Computer & IT Fundamentals%')
        .order('created_at', { ascending: false });

      if (lmsError) {
        if (lmsError.details?.includes('ENOTFOUND') || lmsError.message?.includes('ENOTFOUND')) {
          const hostname = new URL(lmsUrl).hostname;
          errors.push(`Cannot reach Koyitech Africa LMS (${hostname} — DNS lookup failed).`);
        } else {
          errors.push(`LMS database error: ${lmsError.message}`);
        }
      } else if (lmsProfiles) {
        for (const profile of lmsProfiles) {
          if (!profile.email) continue;
          if (profile.role && profile.role !== 'student') continue;

          const fullName = [profile.first_name, profile.last_name]
            .filter(Boolean)
            .join(' ')
            .trim();

          mergeStudent({
            id: String(profile.id),
            name: fullName,
            email: profile.email,
            phone: profile.phone || '',
            course: DEFAULT_COURSE,
            cohort: DEFAULT_COHORT,
            status: 'Enrolled',
            lmsSynced: true,
            created_at: profile.created_at,
          });
        }
      }
    } catch (err: any) {
      errors.push(`Unexpected LMS fetch error: ${err.message}`);
    }
  }

  // 2. Also include any Cohort I ("Computer & IT Fundamentals") enrollees tagged in the Waitlist Auth store
  if (waitlistUrl && waitlistKey) {
    try {
      const waitlistSupabase = createClient(waitlistUrl, waitlistKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      if (waitlistServiceKey) {
        try {
          const { data: authUsersData } = await waitlistSupabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
          });
          if (authUsersData?.users) {
            for (const u of authUsersData.users) {
              if (!u.email) continue;
              const meta = u.user_metadata || {};
              if (!isFreeTrainingCourse(meta.subjects) && !isFreeTrainingCourse(meta.cohort)) {
                continue;
              }

              const metaName =
                meta.full_name ||
                meta.name ||
                [meta.firstName, meta.lastName].filter(Boolean).join(' ') ||
                '';

              mergeStudent({
                id: u.id,
                name: metaName,
                email: u.email,
                phone: meta.phone || '',
                course: DEFAULT_COURSE,
                cohort: DEFAULT_COHORT,
                status: 'Enrolled',
                lmsSynced: false,
                created_at: u.created_at,
              });
            }
          }
        } catch {
          // Ignore admin.listUsers errors cleanly
        }
      }

      // Enrich ONLY already-verified Cohort I enrollees with any missing name/phone from `public.waitlist`
      if (byEmail.size > 0) {
        const enrolledEmailList = Array.from(byEmail.keys());
        const { data: waitlistRows } = await waitlistSupabase
          .from('waitlist')
          .select('email, name, phone')
          .in('email', enrolledEmailList);

        if (waitlistRows) {
          for (const row of waitlistRows) {
            if (!row.email) continue;
            const key = String(row.email).trim().toLowerCase();
            const current = byEmail.get(key);
            if (!current) continue;
            byEmail.set(key, {
              ...current,
              name: current.name || (row.name || '').trim(),
              phone: current.phone || (row.phone || '').trim(),
            });
          }
        }
      }
    } catch {
      // Non-blocking enrichment
    }
  }

  const students = Array.from(byEmail.values()).sort((a, b) => {
    const timeA = Date.parse(a.created_at || '') || 0;
    const timeB = Date.parse(b.created_at || '') || 0;
    return timeB - timeA;
  });

  return {
    students,
    errorMsg: students.length === 0 && errors.length > 0 ? errors[0] : null,
  };
}
