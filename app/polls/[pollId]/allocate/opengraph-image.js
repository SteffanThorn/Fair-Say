import { ImageResponse } from 'next/og';
import { getPollById } from '@/lib/polls';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Fair Say NZ — Where should your tax go? Budget poll.';

export default async function Image({ params }) {
  const { pollId } = await params;
  const poll = getPollById(pollId);
  const question = poll?.question ?? 'Where should your tax go?';
  const optionCount = poll?.options?.length ?? 11;
  const dotColors = (poll?.options ?? []).slice(0, 8).map((o) => o.color);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: 'linear-gradient(135deg, #080f1e 0%, #0b1830 55%, #0a2418 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 14,
            background: '#f59e0b',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', color: '#10b981', fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>
            FAIR SAY NZ
          </div>
          <div
            style={{
              display: 'flex',
              padding: '6px 16px',
              borderRadius: 999,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            BUDGET POLL
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 64,
            fontWeight: 700,
            color: '#f0f4f8',
            lineHeight: 1.12,
            maxWidth: 980,
          }}
        >
          {question}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            fontSize: 30,
            color: '#94a3b8',
            maxWidth: 900,
          }}
        >
          Split 100% across {optionCount} categories — compare pairs, rank directly, or fine-tune your own.
        </div>
        <div style={{ display: 'flex', marginTop: 40, alignItems: 'center' }}>
          {dotColors.map((color, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: color,
                marginRight: 14,
              }}
            />
          ))}
          <div style={{ display: 'flex', marginLeft: 10, fontSize: 26, color: '#f0f4f8', fontWeight: 600 }}>
            Where would you put it?
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 48,
            fontSize: 24,
            color: '#3b82f6',
            fontWeight: 600,
          }}
        >
          fairsay.co.nz/polls
        </div>
      </div>
    ),
    { ...size }
  );
}
