import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dev.lair — Portfolio',
  description:
    'A cozy music lair portfolio — explore projects like vinyl records in a neon-lit pixel art studio.',
  keywords: ['portfolio', 'developer', 'creative', 'pixel art', 'vaporwave'],
  openGraph: {
    title: 'Dev.lair — Portfolio',
    description: 'A cozy music lair portfolio experience.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning prevents noise from browser extensions like DarkReader
    // which inject data-darkreader-* attributes into the HTML element
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
