export default function EraMarker({ era }) {
  return (
    <div
      className="relative z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-5 mb-6"
      style={{ background: '#1A202C', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-0.5">{era.yearRange}</p>
      <h2 className="text-xl font-bold text-white">{era.label}</h2>
      <p className="mt-1 text-sm text-slate-400 italic">{era.description}</p>
    </div>
  );
}
