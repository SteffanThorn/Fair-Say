import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(amount);
}

const BASE_STYLE = `font-family: system-ui, Arial, sans-serif; line-height: 1.65; color: #0f172a; max-width: 580px; margin: 0 auto;`;
const FOOTER = `<hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0"/>
  <p style="font-size:12px;color:#64748b">
    Fair Say NZ — 100% neutral civic platform for New Zealanders.<br>
    We never endorse any party, candidate, or ideology.
  </p>`;

function getHtml(emailType, data) {
  if (emailType === 'welcome') {
    return `<div style="${BASE_STYLE}">
      <h1 style="color:#065f46">Welcome to Fair Say NZ, ${data.name || 'there'}! 🌿</h1>
      <p>You now have access to:</p>
      <ul>
        <li>📰 <strong>Grounded News</strong> — NZ politics from multiple neutral sources</li>
        <li>🗳️ <strong>Parties & MPs</strong> — factual, neutral profiles</li>
        <li>📚 <strong>Civics</strong> — how NZ government really works</li>
        <li>📊 <strong>Polls & Pairwise</strong> — anonymous community voice</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color:#059669">Explore Fair Say NZ →</a></p>
      ${FOOTER}
    </div>`;
  }

  if (emailType === 'order-confirmation') {
    return `<div style="${BASE_STYLE}">
      <h1 style="color:#065f46">Payment confirmed ✅</h1>
      <p>Hi ${data.name || 'there'},</p>
      <p>Your payment for <strong>${data.itemName}</strong> was successful.</p>
      <p>Total: <strong>${formatCurrency(data.amount)}</strong></p>
      <p>Thank you for supporting Fair Say NZ.</p>
      ${FOOTER}
    </div>`;
  }

  if (emailType === 'newsletter') {
    const articleBlocks = (data.articles || []).map((a) => `
      <div style="margin-bottom:28px;border-bottom:1px solid #e2e8f0;padding-bottom:24px">
        ${a.image_url ? `<img src="${a.image_url}" alt="" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;margin-bottom:12px;display:block" />` : ''}
        <p style="margin:0 0 4px;font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.04em">${a.source || ''}</p>
        <h2 style="margin:0 0 8px;font-size:17px;font-weight:700;color:#0f172a;line-height:1.3">
          <a href="${a.url}" style="color:#0f172a;text-decoration:none">${a.title}</a>
        </h2>
        ${a.summary ? `<p style="margin:0 0 10px;font-size:14px;color:#475569;line-height:1.55">${a.summary}</p>` : ''}
        <a href="${a.url}" style="font-size:13px;color:#059669;font-weight:600;text-decoration:none">Read full article →</a>
      </div>
    `).join('');

    return `<div style="${BASE_STYLE}">
      <h1 style="color:#065f46">🌿 Fair Say NZ — Objective Truth Edition</h1>
      <p>${data.intro || 'This week in NZ civic life:'}</p>
      ${articleBlocks}
      ${data.body || ''}
      <p style="margin-top:24px"><a href="${data.unsubscribeUrl || '#'}" style="color:#64748b;font-size:12px">Unsubscribe</a></p>
      ${FOOTER}
    </div>`;
  }

  return '<p>Unsupported email type</p>';
}

export async function POST(request) {
  try {
    const internalApiKey = request.headers.get('x-internal-api-key');
    const isInternalRequest = internalApiKey && internalApiKey === process.env.INTERNAL_API_KEY;

    if (!isInternalRequest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const { to, emailType, data } = await request.json();
    if (!to || !emailType) {
      return NextResponse.json({ error: 'Recipient and email type are required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const subjectMap = {
      'welcome': `Welcome to Fair Say NZ, ${data?.name || 'there'}!`,
      'order-confirmation': 'Fair Say NZ — Payment confirmed',
      'newsletter': data?.subject || 'Fair Say NZ — Objective Truth Edition',
    };
    const subject = subjectMap[emailType] || 'Fair Say NZ notification';

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Fair Say NZ <noreply@fairsaynz.nz>',
      to,
      subject,
      html: getHtml(emailType, data || {}),
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
