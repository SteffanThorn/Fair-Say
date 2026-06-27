import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/serviceSupabase';
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

  // Check monthly free-tier quota (NZT)
  const admin = createServiceClient();
  const nztNow = new Date(new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' }));
  const startOfMonth = new Date(nztNow.getFullYear(), nztNow.getMonth(), 1).toISOString();

  const { count } = await admin
    .from('verification_billing_log')
    .select('*', { count: 'exact', head: true })
    .eq('method', 'didit')
    .eq('successful', true)
    .gte('created_at', startOfMonth);

  const quotaFull = (count || 0) >= 500;
  const nextOpenDate = new Date(nztNow.getFullYear(), nztNow.getMonth() + 1, 1)
    .toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Pacific/Auckland' });

  return (
    <VerifyClient
      verifications={verifications || []}
      completedParam={searchParams?.status === 'done'}
      quotaFull={quotaFull}
      nextOpenDate={nextOpenDate}
    />
  );
}
