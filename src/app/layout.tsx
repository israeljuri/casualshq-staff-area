import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';

const instrument_Sans = Instrument_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Staff Dashboard',
  description: 'CasualsHQ Staff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={instrument_Sans.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
