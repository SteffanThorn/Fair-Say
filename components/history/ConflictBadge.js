'use client';

import { CONFLICT_COLOURS, CONFLICT_LABELS } from '@/lib/historyData';

const CONFLICT_EMOJI = {
  'maori-vs-crown':      '🟠',
  'labour-vs-capital':   '🔵',
  'rich-vs-poor':        '🟢',
  'immigration-identity':'🟣',
  'constitutional':      '🟡',
  'social-progress':     '🩵',
};

export default function ConflictBadge({ conflictType, size = 'sm' }) {
  const colour = CONFLICT_COLOURS[conflictType];
  const label  = CONFLICT_LABELS[conflictType];
  const emoji  = CONFLICT_EMOJI[conflictType];

  const padding = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold tracking-wide text-white ${padding}`}
      style={{ backgroundColor: colour + '33', border: `1px solid ${colour}66` }}
    >
      <span>{emoji}</span>
      <span style={{ color: colour }}>{label}</span>
    </span>
  );
}
