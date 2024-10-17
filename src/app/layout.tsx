/* eslint-disable @next/next/no-sync-scripts */
// src/app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google'; // Optional: Import font

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Map tracker',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Using Next.js Head component for managing head elements */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js" />
        <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js" />
      </head>
      <body className={inter.className}>
		<style>{`
          body {
            background: #010000;
          }
        `}</style>
        {children}
      </body>
    </html>
  );
}
