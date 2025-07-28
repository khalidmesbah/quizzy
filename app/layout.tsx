import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quizzy - Create & Share Interactive Quizzes',
  description: 'Build, share, and discover engaging quizzes with Quizzy. Create interactive content that educates and entertains.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}