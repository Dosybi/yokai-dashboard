import type { Metadata } from 'next';
import { ReactQueryProvider } from '@/shared/lib/react-query';
import { ThemeProvider } from '@/shared/lib/theme';
import { ThemeToggle } from '@/shared/ui/theme-toggle';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Yokai Dashboard',
  description: 'Dashboard application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            <ThemeToggle />
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
