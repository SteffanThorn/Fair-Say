import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.fairsay.co.nz';

/**
 * Build the unsubscribe URL for a given email address.
 * @param {string} email
 * @returns {string}
 */
export function unsubscribeUrl(email) {
  const encoded = Buffer.from(email).toString('base64');
  return `${APP_URL}/unsubscribe?e=${encoded}`;
}

/**
 * Send a transactional or newsletter email via Resend.
 * @param {{ to: string, subject: string, html: string }} params
 */
export async function sendEmail({ to, subject, html }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || 'Fair Say NZ <updates@fairsaynz.nz>',
    to,
    subject,
    html,
  });
}

/**
 * Send the same email to multiple recipients (one Resend call each).
 * @param {{ recipients: string[], subject: string, buildHtml: (email: string) => string }} params
 */
export async function sendBulkEmail({ recipients, subject, buildHtml }) {
  const results = await Promise.allSettled(
    recipients.map((email) =>
      sendEmail({ to: email, subject, html: buildHtml(email) })
    )
  );

  const failed = results
    .map((r, i) => (r.status === 'rejected' ? recipients[i] : null))
    .filter(Boolean);

  if (failed.length) {
    console.error(`[sendBulkEmail] failed for ${failed.length} recipient(s):`, failed);
  }

  return { total: recipients.length, failed: failed.length };
}
