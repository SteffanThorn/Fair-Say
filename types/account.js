/**
 * @typedef {'email' | 'didit'} VerificationTag
 *
 * @typedef {Object} Account
 * @property {string} account_id         - UUID — the Supabase auth user ID, used as the anonymous identity throughout the app
 * @property {VerificationTag} verification_tag
 * @property {boolean} is_verified
 * @property {string | null} email       - Raw email address. Always null for passport-verified (didit) accounts.
 * @property {boolean} newsletter_opt_in - Only meaningful when email is non-null. Defaults to false.
 * @property {string | null} device_hash - One-way hash of device fingerprint; used as a soft duplicate signal.
 * @property {string} created_at
 */
