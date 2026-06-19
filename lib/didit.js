const DIDIT_BASE = 'https://verification.didit.me';

export async function createDiditSession({ verificationRequestToken, callbackUrl }) {
  const res = await fetch(`${DIDIT_BASE}/v3/session/`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.DIDIT_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workflow_id: process.env.DIDIT_WORKFLOW_ID,
      vendor_data: verificationRequestToken,
      callback: callbackUrl,
      expected_details: {
        id_country: 'NZL',
        expected_document_types: ['P', 'DL'],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Didit session creation failed (${res.status}): ${text}`);
  }

  return res.json();
}
