export const metadata = {
  title: 'Privacy Policy — Fair Say NZ',
  description: 'How Fair Say NZ collects, stores, and protects your information.',
};

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-white mb-3 border-b border-white/8 pb-2">{title}</h2>
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="grid sm:grid-cols-[180px_1fr] gap-1 sm:gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-0.5">{label}</span>
      <span className="text-sm text-slate-300 leading-relaxed">{children}</span>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-emerald-400">Fair Say NZ</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: 1 November 2025</p>
      </div>

      <Section title="Who we are">
        <p>
          Fair Say NZ is an independent civic engagement platform. We are not affiliated with any political party, government body, or commercial interest. Our purpose is to give New Zealanders clear, unbiased information about politics and a place to make their voices heard on civic questions.
        </p>
        <p>
          We are subject to the New Zealand Privacy Act 2020, the Privacy Amendment Act 2025, and the Biometric Processing Privacy Code 2025.
        </p>
      </Section>

      <Section title="What we collect and why">
        <p className="text-xs text-slate-500 mb-4">We collect as little as possible. Here is exactly what we hold and why.</p>

        <div className="rounded-xl border border-white/8 bg-white/3 p-4 sm:p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Email signup</h3>
          <div className="divide-y divide-white/5">
            <Row label="What's collected">Your email address at sign-up.</Row>
            <Row label="What's stored">
              A one-way hash of your email (HMAC-SHA256 with a server-side secret). The email address itself is not stored after hashing. The hash cannot be reversed to recover your address.
            </Row>
            <Row label="Purpose">To prevent duplicate accounts. The hash lets us detect if the same email is used again — nothing more.</Row>
            <Row label="Third parties">None. Your email address is not shared with or transmitted to any third party.</Row>
            <Row label="Retention">The hash is retained for the life of your account. Deleting your account deletes this hash.</Row>
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/3 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Didit NZ Passport Verification — Verified NZ Citizen tier</h3>
          <p className="text-xs text-slate-500 mb-3">Optional. This is subject to the NZ Biometric Processing Privacy Code 2025.</p>
          <div className="divide-y divide-white/5">
            <Row label="What's collected">
              You scan your NZ passport and complete a liveness check. This processing is performed entirely by Didit — Fair Say never receives your passport image, biometric template, or passport number.
            </Row>
            <Row label="What Didit sees">
              Your passport document and facial image, for the purpose of the liveness and document check. See{' '}
              <a href="https://didit.me/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                Didit's privacy policy
              </a>{' '}
              for how long they retain this data.
            </Row>
            <Row label="What Fair Say stores">
              A one-way hash of your Didit session ID combined with a server-side secret. This hash cannot be reversed. It cannot be linked to your votes, your email, or any activity on the platform.
            </Row>
            <Row label="Purpose">
              To confirm NZ citizenship for inclusion in the Verified NZ Citizens filter on poll results. Only NZ passports are accepted — a passport is the only document that directly confirms NZ citizenship (not just residency).
            </Row>
            <Row label="Why passport only">
              A NZ driver's licence or proof-of-age card confirms NZ residency but not citizenship. Fair Say's Verified NZ Citizens filter is designed to represent the views of NZ citizens specifically.
            </Row>
            <Row label="Why Didit">
              We assessed alternatives: IRD number verification (requires full name and address — more invasive), RealMe (enterprise-only government system — not available to independent platforms), bank account verification (proves residency, not citizenship). Didit is the least privacy-intrusive method available that confirms NZ citizenship.
            </Row>
            <Row label="Cost">
              $2 NZD, charged only on successful verification. This covers Didit's fee, passed on at cost. You are not charged if verification fails.
            </Row>
            <Row label="Retention">
              The hashed session ID is retained for the life of your account to prevent re-verification attempts. It cannot be used to identify you. Deleting your account deletes this hash.
            </Row>
          </div>
        </div>
      </Section>

      <Section title="Polls and votes">
        <p>
          <strong className="text-white">Anyone with a Fair Say account can vote in any poll.</strong> There is no gatekeeping based on verification tier. Verification affects only how your responses are displayed in results filters — it does not affect whether your vote counts.
        </p>
        <p>
          All votes are anonymous. A per-poll hash is generated using your account identifier, the poll ID, a device salt, and a server-side secret. This hash prevents duplicate votes. It cannot be reversed to identify you, and it changes between polls — so your votes across different polls cannot be linked to each other.
        </p>
        <p>
          Each vote is tagged with your account's verification tier at the time of voting: <code className="text-xs bg-white/5 rounded px-1 py-0.5">email</code> or <code className="text-xs bg-white/5 rounded px-1 py-0.5">verified_nz_citizen</code>. This tag identifies the credential type, not you personally.
        </p>
        <p>
          Poll results are filterable by tier — all respondents, email accounts, or Verified NZ Citizens. The filter is a transparency tool, not a weighting system. Every vote counts equally in the overall result. Filtered groups with fewer than 5 responses are suppressed entirely to prevent any possibility of de-anonymising small groups.
        </p>
        <p>Individual responses are never shown. Results are published as aggregates only, and always will be.</p>
      </Section>

      <Section title="What we never do">
        <ul className="space-y-2">
          {[
            'We never sell personal information.',
            'We never share data with political parties, advertisers, or government agencies.',
            'We never use biometric information for any purpose other than confirming NZ citizenship.',
            'We never store passport images, biometric templates, or passport numbers.',
            'We never link verification records to votes or browsing activity.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 shrink-0">✕</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Your rights under the Privacy Act 2020">
        <p>You have the following rights regarding information Fair Say holds about you:</p>
        <ul className="space-y-2 mt-2">
          <li><strong className="text-white">Right to access:</strong> You can request what data we hold about you. Because we store one-way hashes rather than identifiable information, the data we can provide is limited by design.</li>
          <li><strong className="text-white">Right to correction:</strong> You can request corrections to any personal information we hold.</li>
          <li><strong className="text-white">Right to deletion:</strong> You can delete your account at any time. Deletion removes your hashed email identifier, hashed verification session ID, and account record. Vote records are anonymous and cannot be attributed to you — they are not deleted, as they form part of the aggregate public results.</li>
          <li>
            <strong className="text-white">Complaints:</strong> If you believe we have breached the Privacy Act 2020, you can complain to the Office of the Privacy Commissioner at{' '}
            <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
              privacy.org.nz
            </a>.
          </li>
        </ul>
      </Section>

      <Section title="Third-party processors">
        <div className="space-y-3">
          {[
            {
              name: 'Didit',
              role: 'Biometric identity verification. Processes NZ passport scans and liveness checks on Fair Say\'s behalf. Fair Say receives only a pass/fail result.',
              link: 'https://didit.me/privacy',
            },
            {
              name: 'Supabase',
              role: 'Database hosting. Data is stored in AWS ap-southeast-2 (Sydney, Australia).',
              link: 'https://supabase.com/privacy',
            },
            {
              name: 'Vercel',
              role: 'Application hosting and edge functions.',
              link: 'https://vercel.com/legal/privacy-policy',
            },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-white/8 bg-white/2 px-4 py-3">
              <p className="text-sm font-semibold text-white">{p.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{p.role}</p>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline mt-0.5 inline-block">
                Privacy policy →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Biometric processing">
        <p>
          Fair Say is subject to the NZ Biometric Processing Privacy Code 2025 (in force 3 November 2025). In accordance with this Code:
        </p>
        <ul className="space-y-2 mt-2">
          <li>Biometric processing (passport scan and liveness check) is performed solely by Didit, not by Fair Say.</li>
          <li>The purpose is limited to confirming NZ citizenship for inclusion in the Verified NZ Citizens results filter.</li>
          <li>No biometric information is retained by Fair Say — only a one-way hash of the Didit session ID.</li>
          <li>A Proportionality Assessment has been completed and is available on request.</li>
          <li>Complaints about biometric processing can be directed to the Privacy Commissioner at <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">privacy.org.nz</a>.</li>
        </ul>
      </Section>

      <Section title="Contact">
        <p>
          For privacy questions, access requests, or corrections, contact us at{' '}
          <a href="mailto:privacy@fair-say.nz" className="text-cyan-400 hover:underline">
            privacy@fair-say.nz
          </a>.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Fair Say NZ is an independent platform. We are not a government body and cannot access government records on your behalf.
        </p>
      </Section>
    </main>
  );
}
