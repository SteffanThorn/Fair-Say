export default function MemberMark({ authMethod }) {
  if (authMethod === 'gitcoin') {
    return (
      <span
        title="Gitcoin Passport member"
        className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-medium text-purple-300 leading-none"
      >
        ⬡ Passport
      </span>
    );
  }

  return (
    <span
      title="Email member"
      className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300 leading-none"
    >
      ✉ Email
    </span>
  );
}
