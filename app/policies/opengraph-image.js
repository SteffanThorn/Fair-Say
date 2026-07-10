import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Party Policies Compared — Fair Say NZ';

const PARTY_COLORS = [
  '#1a56a4', // National
  '#cc0000', // Labour
  '#098137', // Green Party
  '#d4a017', // ACT
  '#4b5563', // NZ First
  '#b5281e', // Te Pāti Māori
  '#0891b2', // The Opportunity Party
  '#4f46e5', // Conservative Party NZ
  '#15803d', // ALCP
];

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
        <div style={{ display: 'flex', color: '#10b981', fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>
          FAIR SAY NZ
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 68,
            fontWeight: 700,
            color: '#f0f4f8',
            lineHeight: 1.1,
            maxWidth: 960,
          }}
        >
          Party Policies Compared
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
          Housing · Economy &amp; Tax · Health · Treaty · Immigration · Education
        </div>
        <div style={{ display: 'flex', marginTop: 40, alignItems: 'center' }}>
          {PARTY_COLORS.map((color) => (
            <div
              key={color}
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
            9 parties, side by side
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
          fairsay.co.nz/policies
        </div>
      </div>
    ),
    { ...size }
  );
}
