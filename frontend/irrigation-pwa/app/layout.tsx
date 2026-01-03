// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🎮 Pixel Irrigation System',
  description: 'Retro Soil Humidity Monitoring and Irrigation Control',
  manifest: '/manifest.json',
  themeColor: '#1a1a2e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] min-h-screen">
        {children}
      </body>
    </html>
  );
}
