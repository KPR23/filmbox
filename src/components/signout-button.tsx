'use client';

import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingButton from './loading-button';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    try {
      setPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login');
          },
        },
      });
    } catch (error) {
      console.log('Error while signing out', error);
    } finally {
      setPending(false);
    }
  };

  return (
    <LoadingButton pending={pending} onClick={handleSignOut}>
      <LogOut />
      Wyloguj się
    </LoadingButton>
  );
}
