import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import Script from 'next/script';
import '../styles/gradient-bg.css';

// Import the client component wrapper
import ClientLayout from '../components/ClientLayout';
import { AuthProvider } from '../lib/hooks/useAuth';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalentSpottingAI",
  description: "AI-powered talent acquisition platform connecting employers with the right candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900`}
      >
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
