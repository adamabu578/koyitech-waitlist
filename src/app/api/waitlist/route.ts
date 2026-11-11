import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // 1. Insert into Supabase (if configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert([{ email, name, phone }]);

      if (dbError) {
        if (dbError.code === '23505') {
          return NextResponse.json({ error: 'This email has already joined Cohort I!' }, { status: 409 });
        }
        
        console.error('Supabase insertion error:', dbError.message, dbError.details);
        if (dbError.details?.includes('ENOTFOUND') || dbError.message?.includes('fetch failed')) {
          return NextResponse.json(
            { error: 'Cannot reach the database right now. Please check your connection and try again.' },
            { status: 503 }
          );
        }
        return NextResponse.json({ error: dbError.message || 'Failed to join Cohort I' }, { status: 500 });
      }
    } else {
      console.warn("Supabase credentials missing, skipping database insertion");
    }

    // 2. Send email via Resend
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
       console.error("RESEND_API_KEY is missing or invalid");
       // For dev purposes if key is missing, just simulate success to avoid breaking the form
       return NextResponse.json({ success: true, simulated: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send email to the user who joined
    const { data, error: resendError } = await resend.emails.send({
      from: 'Koyitech Africa <info@koyitech.africa>',
      to: email,
      subject: 'Welcome to Koyitech Africa Waitlist! 🚀',
      react: WelcomeEmail(),
    });

    if (resendError) {
      console.error('Resend email error:', resendError);
    }

    return NextResponse.json({ success: true, data, resendError });
  } catch (error: any) {
    console.error('Error in waitlist route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
