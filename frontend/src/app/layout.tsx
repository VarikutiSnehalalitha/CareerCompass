import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'CareerCompass – Competitive Exam Prep & Job Discovery Platform',
  description: 'Complete full-stack career preparation ecosystem with hierarchical syllabi, previous-year question papers, smart timetables, CBT mock tests, and AI StudyMate.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="nature" data-mode="light" data-intensity="balanced">
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 max-w-7xl w-full mx-auto">
              <Sidebar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
