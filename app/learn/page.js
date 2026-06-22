import { createClient, createAdminClient } from '@/lib/supabase/server';
import LearnClient from './LearnClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Learn & Earn Your Voice — Fair Say NZ',
  description: 'Short courses, honest tests, and badges that mean something. Coming soon to Fair Say NZ.',
};

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isVerifiedCitizen = false;
  let learnNotify = false;

  if (user) {
    const admin = await createAdminClient();

    const { data: account } = await admin
      .from('accounts')
      .select('verification_tag, is_verified, learn_notify, learn_sneak_peek_viewed_at')
      .eq('account_id', user.id)
      .maybeSingle();

    isVerifiedCitizen = !!(account?.is_verified && account?.verification_tag === 'didit');
    learnNotify = account?.learn_notify ?? false;

    // Log first sneak-peek view — once only, server-side to avoid race conditions
    if (isVerifiedCitizen && !account?.learn_sneak_peek_viewed_at) {
      await admin
        .from('accounts')
        .update({ learn_sneak_peek_viewed_at: new Date().toISOString() })
        .eq('account_id', user.id);
    }
  }

  return (
    <LearnClient
      isAuthenticated={!!user}
      isVerifiedCitizen={isVerifiedCitizen}
      initialLearnNotify={learnNotify}
    />
  );
}
