import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Fair Say NZ — Everyone gets a fair say.';

export default async function Image() {
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
            background: '#10b981',
          }}
        />
        <div style={{ display: 'flex', color: '#10b981', fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>
          FAIR SAY NZ
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 76,
            fontWeight: 700,
            color: '#f0f4f8',
            lineHeight: 1.08,
            maxWidth: 920,
          }}
        >
          Everyone gets a fair say.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 32,
            color: '#94a3b8',
            maxWidth: 880,
          }}
        >
          100% neutral, NZ-focused civic platform.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 56,
            fontSize: 26,
            color: '#3b82f6',
            fontWeight: 600,
          }}
        >
          fairsay.co.nz
        </div>
      </div>
    ),
    { ...size }
  );
}
