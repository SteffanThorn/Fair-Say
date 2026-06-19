import { createHmac, timingSafeEqual } from 'crypto';

function sortKeysDeep(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  return Object.keys(obj)
    .sort()
    .reduce((acc, k) => { acc[k] = sortKeysDeep(obj[k]); return acc; }, {});
}

function hmacHex(secret, data) {
  const hmac = createHmac('sha256', secret);
  if (typeof data === 'string') {
    hmac.update(data, 'utf8');
  } else {
    hmac.update(data);
  }
  return hmac.digest('hex');
}

function safeEqual(a, b) {
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

export function verifyDiditWebhook(rawBody, headers) {
  const secret = process.env.DIDIT_WEBHOOK_SECRET;
  if (!secret) throw new Error('DIDIT_WEBHOOK_SECRET not configured');

  const timestamp = headers.get('x-timestamp');
  if (!timestamp || Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) {
    throw new Error('Webhook timestamp invalid or expired');
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error('Invalid JSON body');
  }

  const sigV2 = headers.get('x-signature-v2');
  const sigSimple = headers.get('x-signature-simple');
  const sigOriginal = headers.get('x-signature');

  // V2 (preferred): canonical JSON with sorted keys, UTF-8 encoded
  if (sigV2) {
    const canonical = JSON.stringify(sortKeysDeep(body));
    const encoded = new TextEncoder().encode(canonical);
    if (safeEqual(sigV2, hmacHex(secret, encoded))) return body;
  }

  // Simple: timestamp:session_id:status:webhook_type — avoids JSON serialisation entirely
  if (sigSimple) {
    const { session_id, status, webhook_type } = body;
    const msg = `${timestamp}:${session_id}:${status}:${webhook_type}`;
    if (safeEqual(sigSimple, hmacHex(secret, msg))) return body;
  }

  // Original: raw body bytes (fragile if middleware touches the body)
  if (sigOriginal) {
    if (safeEqual(sigOriginal, hmacHex(secret, rawBody))) return body;
  }

  throw new Error('Webhook signature verification failed — all methods exhausted');
}
