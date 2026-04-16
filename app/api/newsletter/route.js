import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import dbConnect from '@/lib/mongodb';
import NewsletterSubscriber from '@/lib/models/NewsletterSubscriber';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    await dbConnect();

    // Idempotent — re-subscribe if previously unsubscribed
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      existing.isActive = true;
      existing.subscribedAt = new Date();
      await existing.save();
      return NextResponse.json({ message: 'Re-subscribed successfully' });
    }

    const subscriber = await NewsletterSubscriber.create({
      email: email.toLowerCase(),
      name: name || '',
      unsubscribeToken: randomUUID(),
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ email: subscriber.email, name: subscriber.name || 'there' }).catch((err) =>
      console.error('[newsletter] Welcome email failed:', err.message)
    );

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/newsletter]', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}

// Unsubscribe via GET /api/newsletter?token=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    await dbConnect();
    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });
    if (!subscriber) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    subscriber.isActive = false;
    await subscriber.save();

    return NextResponse.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('[GET /api/newsletter]', error);
    return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 });
  }
}
