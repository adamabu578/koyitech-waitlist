import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { createClient } from '@supabase/supabase-js';
import { getLmsSupabaseConfig, recordStudentInWaitlistDb } from '@/lib/enrolledStudents';

const DEFAULT_LOGIN_URL = 'https://koyitech.africa/login';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, password } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Please create a password of at least 6 characters' },
        { status: 400 }
      );
    }

    const loginUrl = process.env.NEXT_PUBLIC_CLASSROOM_LOGIN_URL || DEFAULT_LOGIN_URL;

    // Split full name into firstName and lastName to match Koyitech Africa's `profiles` schema & auth trigger
    const trimmedName = String(name).trim();
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0] || trimmedName;
    const lastName = nameParts.slice(1).join(' ') || '';

    // 1. Create student account & auto-enroll in Koyitech Africa's main LMS Supabase project
    const { lmsUrl, lmsAnonKey } = getLmsSupabaseConfig();

    {
      const lmsSupabase = createClient(lmsUrl, lmsAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      let lmsUser = null;
      let lmsSession = null;

      const { data: signUpData, error: signUpError } = await lmsSupabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            full_name: trimmedName,
            phone: phone || '',
            role: 'student',
            status: 'active',
            subjects: 'Computer & IT Fundamentals',
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message || '';
        if (msg.toLowerCase().includes('already')) {
          // If the student already has a Koyitech Africa account, verify their password so we can still enroll them in Cohort I
          const { data: signInData, error: signInError } =
            await lmsSupabase.auth.signInWithPassword({ email, password });

          if (signInError) {
            return NextResponse.json(
              {
                error:
                  'An account with this email already exists on Koyitech Africa! Click "Login to Classroom" below using your existing password.',
              },
              { status: 409 }
            );
          }

          lmsUser = signInData.user;
          lmsSession = signInData.session;
        } else if (msg.includes('fetch failed') || msg.includes('ENOTFOUND')) {
          return NextResponse.json(
            {
              error:
                'Cannot reach Koyitech Africa authentication server right now. Please check your internet connection and try again.',
            },
            { status: 503 }
          );
        } else {
          console.error('Koyitech Africa LMS signUp error:', signUpError);
          return NextResponse.json(
            { error: msg || 'Failed to create Koyitech Africa student account' },
            { status: 500 }
          );
        }
      } else {
        lmsUser = signUpData.user;
        lmsSession = signUpData.session;
      }

      // Auto-enroll the student in "Computer & IT Fundamentals" inside Koyitech Africa LMS
      if (lmsUser && lmsSession?.access_token) {
        try {
          const authedLms = createClient(lmsUrl, lmsAnonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: {
              headers: { Authorization: `Bearer ${lmsSession.access_token}` },
            },
          });

          // Ensure profile row has first_name / last_name populated
          await authedLms.from('profiles').upsert(
            [
              {
                id: lmsUser.id,
                email,
                first_name: firstName,
                last_name: lastName,
                phone: phone || '',
                role: 'student',
                status: 'active',
                subjects: 'Computer & IT Fundamentals',
              },
            ],
            { onConflict: 'id' }
          );

          // Find or create the "Computer & IT Fundamentals" course
          let courseId: string | null = null;
          const { data: existingCourses } = await authedLms
            .from('courses')
            .select('id, title')
            .ilike('title', '%Computer & IT Fundamentals%')
            .limit(1);

          if (existingCourses && existingCourses.length > 0) {
            courseId = String(existingCourses[0].id);
          } else {
            const { data: createdCourse } = await authedLms
              .from('courses')
              .insert([
                {
                  title: 'Computer & IT Fundamentals',
                  description:
                    '100% Free Cohort I training covering computer basics, office productivity suites, internet & cloud tools, and everyday IT troubleshooting.',
                  duration: '8 Weeks',
                  price: 'Free',
                  status: 'Published',
                },
              ])
              .select('id')
              .single();

            if (createdCourse?.id) {
              courseId = String(createdCourse.id);
            }
          }

          if (courseId) {
            const { data: existingEnrollment } = await authedLms
              .from('enrollments')
              .select('id')
              .eq('student_id', lmsUser.id)
              .eq('course_id', courseId)
              .limit(1);

            if (!existingEnrollment || existingEnrollment.length === 0) {
              await authedLms.from('enrollments').insert([
                {
                  student_id: lmsUser.id,
                  course_id: courseId,
                  progress: 0,
                },
              ]);
            }
          }
        } catch (enrollErr) {
          console.error('Auto-enrollment warning:', enrollErr);
        }
      }
    }

    // 2. Record the enrolled student in the waitlist Supabase database (for /admin & broadcast emails)
    await recordStudentInWaitlistDb({ email, name: trimmedName, phone });

    // 3. Send Welcome + Classroom Login email via Resend
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
      console.error('RESEND_API_KEY is missing or invalid');
      return NextResponse.json({ success: true, simulated: true, loginUrl });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error: resendError } = await resend.emails.send({
      from: 'Koyitech Africa <info@koyitech.africa>',
      to: email,
      subject: 'Your Cohort I Account is Ready — Login & Attend Classes! 🚀',
      react: WelcomeEmail({ name: firstName, email, loginUrl }),
    });

    if (resendError) {
      console.error('Resend email error:', resendError);
    }

    return NextResponse.json({ success: true, loginUrl, data, resendError });
  } catch (error: any) {
    console.error('Error in waitlist route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
