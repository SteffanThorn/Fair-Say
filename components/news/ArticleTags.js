'use client';

/**
 * @typedef {import('@/types/news').BiasTendency} BiasTendency
 * @typedef {import('@/types/news').ValidityRating} ValidityRating
 * @typedef {import('@/types/news').SourceType} SourceType
 */

const BIAS_CFG = {
  'left':           { label: 'Left',             bg: '#c0392b' },
  'centre-left':    { label: 'Centre-Left',       bg: '#e67e22' },
  'centre':         { label: 'Centre',            bg: '#7f8c8d' },
  'centre-right':   { label: 'Centre-Right',      bg: '#2980b9' },
  'right':          { label: 'Right',             bg: '#1a5276' },
  'focused-agenda': { label: '🎯 Focused agenda', bg: '#6c3483' },
};

const VALIDITY_CFG = {
  high:    '🟢 High validity',
  medium:  '🟡 Medium validity',
  low:     '🔴 Low validity',
  unrated: '⚪ Unrated',
};

const TYPE_CFG = {
  news:     { label: '📰 News',     color: '#3498db' },
  blog:     { label: '✍️ Blog',     color: '#f39c12' },
  podcast:  { label: '🎙️ Podcast',  color: '#9b59b6' },
  research: { label: '🔬 Research', color: '#1abc9c' },
  advocacy: { label: '📢 Advocacy', color: '#e74c3c' },
};

const PILL = {
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: '999px',
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
};

const MUTED_PILL = {
  ...PILL,
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#94a3b8',
};

/**
 * Renders bias, validity, type, paywall, and funding tags for an article card.
 *
 * @param {{
 *   sourceBias: BiasTendency | null,
 *   sourceValidity: ValidityRating | null,
 *   sourceType: SourceType | null,
 *   hasPaywall: boolean | string,
 *   fundedBy: string | null,
 * }} props
 */
export default function ArticleTags({ sourceBias, sourceValidity, sourceType, hasPaywall, fundedBy }) {
  const biasCfg    = sourceBias    ? BIAS_CFG[sourceBias]       : null;
  const validityLbl = sourceValidity ? VALIDITY_CFG[sourceValidity] : null;
  const typeCfg    = sourceType    ? TYPE_CFG[sourceType]       : null;

  if (!biasCfg && !validityLbl && !typeCfg && !hasPaywall && !fundedBy) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {biasCfg && (
        <span style={{ ...PILL, backgroundColor: biasCfg.bg, color: '#fff' }}>
          {biasCfg.label}
        </span>
      )}

      {validityLbl && (
        <span style={MUTED_PILL}>{validityLbl}</span>
      )}

      {hasPaywall && (
        <span style={MUTED_PILL}>
          🔒 {hasPaywall === 'full' ? 'Subscription' : 'Paywall'}
        </span>
      )}

      {typeCfg && (
        <span style={{ ...PILL, border: `1px solid ${typeCfg.color}`, color: typeCfg.color, backgroundColor: 'transparent' }}>
          {typeCfg.label}
        </span>
      )}

      {fundedBy && (
        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
          💰 {fundedBy}
        </span>
      )}
    </div>
  );
}
