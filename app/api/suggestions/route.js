import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/send';
import { checkRateLimit, getRequestIp } from '@/lib/rateLimit';

const OWNER_EMAIL = 'innerlightyuki@gmail.com';

export async function POST(request) {
  const ip = getRequestIp(request);
  const { allowed } = await checkRateLimit({ key: `suggestions:${ip}`, limit: 10, windowSeconds: 3600 });
  if (!allowed) {
    return NextResponse.json({ error: 'Too many submissions — please try again later' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { suggestion, contact_email, page } = body;

  if (!suggestion?.trim() || suggestion.trim().length < 5) {
    return NextResponse.json({ error: 'Please enter a suggestion (at least 5 characters).' }, { status: 400 });
  }

  if (suggestion.trim().length > 2000) {
    return NextResponse.json({ error: 'Suggestion is too long (max 2000 characters).' }, { status: 400 });
  }

  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_replace_me') {
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;line-height:1.6">
        <h2 style="color:#065f46">💡 New site suggestion</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${page ? `<tr><td style="padding:8px 0;color:#64748b;width:140px">Page</td><td style="padding:8px 0">${page}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Suggestion</td><td style="padding:8px 0;white-space:pre-wrap">${suggestion.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td></tr>
          ${contact_email?.trim() ? `<tr><td style="padding:8px 0;color:#64748b">Reply to</td><td style="padding:8px 0">${contact_email.trim()}</td></tr>` : ''}
        </table>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0"/>
        <p style="font-size:12px;color:#64748b">Fair Say NZ — site suggestion</p>
      </div>
    `;

    await sendEmail({
      to: OWNER_EMAIL,
      subject: `[Fair Say] New suggestion${page ? ` from ${page}` : ''}`,
      html,
    }).catch((err) => console.error('[suggestions] email failed:', err.message));
  }

  return NextResponse.json({ ok: true });
}
