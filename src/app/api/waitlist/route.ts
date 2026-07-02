import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Insert into Supabase (if configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (dbError) {
        console.error('Supabase insertion error:', dbError);
        // Temporarily bypassing DB errors so user can test frontend modal
        // if (dbError.code !== '23505') { 
        //   return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 });
        // }
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
    await resend.emails.send({
      from: 'Koyitech Africa <onboarding@resend.dev>', // Replace with your verified domain in production
      to: email,
      subject: 'Welcome to Koyitech Africa Waitlist! 🚀',
      react: WelcomeEmail(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in waitlist route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
