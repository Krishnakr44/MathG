import type { Metadata } from 'next';
import { MistakeBankWrapper } from './MistakeBankWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'MathG — Math Visualization & Mistake Lab',
  description: 'For Indian middle-school teachers (Class 6–8)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MistakeBankWrapper>{children}</MistakeBankWrapper>
      </body>
    </html>
  );
}
