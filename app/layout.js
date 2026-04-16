import './globals.css';
import { auth } from '@/auth';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: {
    default: 'CivicEchoNZ — Better civic information',
    template: '%s | CivicEchoNZ',
  },
  description:
    'CivicEchoNZ: 100% apolitical, NZ-focused civic education and engagement. Grounded News, party info, MP contacts, polls and real ways to have your say.',
  keywords: ['New Zealand', 'civics', 'parliament', 'election 2026', 'NZ politics', 'civic education'],
  themeColor: '#080f1e',
  manifest: '/manifest.json',
  openGraph: {
    title: 'CivicEchoNZ',
    description: 'Better information than the government. Education + real ways to have your say.',
    locale: 'en_NZ',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080f1e',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en-NZ">
      <body>
        <Sidebar session={session} />
        <div className="page-content min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
