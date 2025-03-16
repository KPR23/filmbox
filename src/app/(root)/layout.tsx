import { Navbar } from '@/components/navbar';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Navbar />
      {children}
      <Toaster />
    </section>
  );
}
