import { createAdminClient } from '@/lib/supabase/server';

/**
 * Returns all email addresses that have opted in to newsletter updates.
 * Passport-tier accounts always have email = null and are automatically excluded.
 * @returns {Promise<string[]>}
 */
export async function getNewsletterSubscribers() {
  const admin = await createAdminClient();

  const { data, error } = await admin
    .from('accounts')
    .select('email')
    .eq('newsletter_opt_in', true)
    .not('email', 'is', null);

  if (error) throw error;

  return data.map((row) => row.email);
}
