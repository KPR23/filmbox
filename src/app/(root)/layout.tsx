import { Navbar } from '@/components/navbar';
import { Toaster } from 'sonner';
import { auth } from '@/auth/auth';
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <section>
      <Navbar session={session} />
      {children}
      <Toaster />
    </section>
  );
}
