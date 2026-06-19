import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import VerifyClient from './VerifyClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Verify your account',
};

export default async function VerifyPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: verifications } = await supabase
    .from('account_verifications')
    .select('method, verified_at, passport_score, expires_at')
    .eq('account_id', user.id);

  return (
    <VerifyClient
      verifications={verifications || []}
      completedParam={searchParams?.status === 'done'}
    />
  );
}
