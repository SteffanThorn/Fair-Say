import './globals.css';
import { auth } from '@/auth';
import Sidebar from '@/components/Sidebar';
import ContentShell from '@/components/ContentShell';
import SuggestButton from '@/components/SuggestButton';
import TutorialModal from '@/components/TutorialModal';

export const metadata = {
  title: {
    default: 'Fair Say NZ — Everyone gets a fair say.',
    template: '%s | Fair Say NZ',
  },
  description:
    'Fair Say NZ: 100% neutral, NZ-focused civic platform. News, party info, MP contacts, polls and real ways to have your say.',
  keywords: ['New Zealand', 'civics', 'parliament', 'election 2026', 'NZ politics', 'civic education'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Fair Say',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    title: 'Fair Say NZ',
    description: 'Fair Say NZ: 100% neutral, NZ-focused civic platform. News, party info, MP contacts, polls and real ways to have your say.',
    locale: 'en_NZ',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en-NZ">
      <body>
        <Sidebar session={session} />
        <ContentShell>{children}</ContentShell>
        <SuggestButton />
        <TutorialModal isMember={!!session?.user} />
      </body>
    </html>
  );
}
