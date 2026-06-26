'use client';

import { usePathname } from 'next/navigation';

export default function ContentShell({ children }) {
  const pathname = usePathname();
  return (
    <div className={pathname === '/' ? 'min-h-screen' : 'page-content min-h-screen'}>
      {children}
    </div>
  );
}
