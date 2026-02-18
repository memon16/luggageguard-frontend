// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'LuggageGuard - Secure Luggage Storage in Miami',
  description: 'Store your luggage safely in Miami Brickell. Book pickup, storage, and delivery with LuggageGuard.',
  keywords: ['luggage storage', 'Miami', 'Brickell', 'hotel luggage', 'bag storage'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}