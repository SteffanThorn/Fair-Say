import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Session established — redirect to auth page to finalize account
      return NextResponse.redirect(`${origin}/auth?magic=1`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=link-expired`);
}
