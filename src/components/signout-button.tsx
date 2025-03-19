'use client';

import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Power } from 'lucide-react';
import LoadingButton from './loading-button';

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
    <LoadingButton
      pending={pending}
      onClick={handleSignOut}
      className="text-black"
    >
      <div className="flex items-center justify-center">
        <Power className="w-4 h-4 mr-2" />
        Wyloguj się
      </div>
    </LoadingButton>
  );
}
