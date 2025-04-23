// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Web3 Subscribe Platform',
  description: 'Your one-stop platform for supporting creators with Web3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <Providers>
          <main className="flex flex-col min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}