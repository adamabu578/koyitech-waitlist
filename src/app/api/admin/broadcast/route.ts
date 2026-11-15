import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import BroadcastEmail from '@/emails/BroadcastEmail';
import { getEnrolledStudents } from '@/lib/enrolledStudents';

export async function POST(request: Request) {
  try {
    const { subject, body } = await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Fetch all enrolled students (Waitlist DB + Koyitech Africa LMS)
    const { students: subscribers, errorMsg } = await getEnrolledStudents();

    if (errorMsg) {
      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No enrolled students found.' },
        { status: 400 }
      );
    }

    // 2. Prepare Resend Batch
    if (!resendApiKey || resendApiKey === 'your_resend_api_key') {
      console.warn("Simulating broadcast since RESEND_API_KEY is not configured.");
      // Simulate success for dev environment
      return NextResponse.json({ success: true, count: subscribers.length, simulated: true });
    }

    const resend = new Resend(resendApiKey);

    // Resend batch limits to 100 emails per request, chunk the array
    const chunkSize = 100;
    const batches = [];
    for (let i = 0; i < subscribers.length; i += chunkSize) {
      batches.push(subscribers.slice(i, i + chunkSize));
    }

    let successCount = 0;

    for (const batch of batches) {
      const emailPayloads = batch.map((sub) => ({
        from: 'Koyitech Africa <info@koyitech.africa>', // Replace with your verified domain
        to: [sub.email],
        subject: subject,
        react: BroadcastEmail({ subject, body }) as React.ReactElement,
      }));

      const { data, error } = await resend.batch.send(emailPayloads);

      if (error) {
        console.error('Resend batch error:', error);
        // If one batch fails, we might still want to return a partial success or error
        throw new Error(error.message);
      }
      
      successCount += batch.length;
    }

    return NextResponse.json({ success: true, count: successCount });
  } catch (error: any) {
    console.error('Broadcast error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while sending emails' },
      { status: 500 }
    );
  }
}
