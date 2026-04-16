import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ ok: true, service: 'civicechonz', ts: new Date().toISOString() });
}
