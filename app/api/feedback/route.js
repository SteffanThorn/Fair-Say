import { NextResponse } from 'next/server';
import { getDataClient } from '@/lib/supabase/data';
import { sendEmail } from '@/lib/email/send';

const OWNER_EMAIL = 'innerlightyuki@gmail.com';

const INDICATOR_LABELS = {
  bias:        'Bias rating',
  validity:    'Validity rating',
  source_type: 'Source type',
  other:       'Other',
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { source_name, indicator, feedback, suggestion, contact_email } = body;

  if (!source_name?.trim() || !indicator || !feedback?.trim()) {
    return NextResponse.json({ error: 'source_name, indicator, and feedback are required' }, { status: 400 });
  }

  const validIndicators = ['bias', 'validity', 'source_type', 'other'];
  if (!validIndicators.includes(indicator)) {
    return NextResponse.json({ error: 'Invalid indicator value' }, { status: 400 });
  }

  const supabase = getDataClient();

  const { error: dbError } = await supabase.from('source_feedback').insert({
    source_name: source_name.trim(),
    indicator,
    feedback: feedback.trim(),
    suggestion: suggestion?.trim() || null,
    contact_email: contact_email?.trim().toLowerCase() || null,
  });

  if (dbError) {
    console.error('[POST /api/feedback] db error:', dbError);
    return NextResponse.json({ error: 'Could not save feedback' }, { status: 500 });
  }

  // Email notification to owner — non-blocking
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_replace_me') {
    const indicatorLabel = INDICATOR_LABELS[indicator] || indicator;
    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;line-height:1.6">
        <h2 style="color:#065f46">📋 New source indicator feedback</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#64748b;width:140px">Source</td><td style="padding:8px 0;font-weight:600">${source_name.trim()}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Indicator</td><td style="padding:8px 0">${indicatorLabel}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Feedback</td><td style="padding:8px 0">${feedback.trim().replace(/\n/g, '<br>')}</td></tr>
          ${suggestion?.trim() ? `<tr><td style="padding:8px 0;color:#64748b">Suggestion</td><td style="padding:8px 0">${suggestion.trim()}</td></tr>` : ''}
          ${contact_email?.trim() ? `<tr><td style="padding:8px 0;color:#64748b">Contact</td><td style="padding:8px 0">${contact_email.trim()}</td></tr>` : ''}
        </table>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0"/>
        <p style="font-size:12px;color:#64748b">Fair Say NZ — source feedback notification</p>
      </div>
    `;

    sendEmail({
      to: OWNER_EMAIL,
      subject: `[Fair Say] Feedback on ${source_name.trim()} — ${indicatorLabel}`,
      html,
    }).catch((err) => console.error('[feedback] notification email failed:', err.message));
  }

  return NextResponse.json({ ok: true });
}
