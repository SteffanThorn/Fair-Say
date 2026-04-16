import { signOut } from '@/auth';

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
      >
        Sign out
      </button>
    </form>
  );
}
