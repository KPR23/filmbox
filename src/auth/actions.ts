'use server';

import { checkEmail } from '@/actions/email-check';
import { userDetailsSchema } from '@/lib/userSchema';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { authClient } from './auth-client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ErrorContext } from '@better-fetch/fetch';
import { z } from 'zod';
import { signInSchema } from '@/lib/zod';

interface HandleEmailSubmitProps {
  email: string;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setShowPassword: (show: boolean) => void;
  form: UseFormReturn<z.infer<typeof signInSchema>>;
  setIsLoading: (loading: boolean) => void;
}

export async function handleEmailSubmit({
  email,
  setEmail,
  setName,
  setShowPassword,
  form,
  setIsLoading,
}: HandleEmailSubmitProps): Promise<void> {
  setIsLoading(true);

  try {
    const emailExists = await checkEmail(email);

    if (emailExists) {
      const response = await fetch(`/api/user/email?email=${email}`);
      const userData = await response.json();

      const parsedUserDetails = userDetailsSchema.parse(userData);

      if (parsedUserDetails.emailVerified) {
        const firstName = parsedUserDetails.name.split(' ')[0];
        setName(firstName);
        setEmail(email);
        setShowPassword(true);
      } else {
        form.setError('email', {
          type: 'manual',
        });
        toast.error('Konto nie zostało jeszcze aktywowane', {
          description:
            'Aktywuj konto klikając w link weryfikacyjny wysłany na Twój adres e-mail',
          duration: 10000,
        });
      }
    } else {
      form.setError('email', {
        type: 'manual',
      });
      toast.error('Nie znaleziono konta o podanym adresie e-mail', {
        description: 'Sprawdź, czy adres został wpisany poprawnie',
      });
    }
  } catch (error) {
    console.error('Sign-in error:', error);
    toast.error('Wystąpił błąd', {
      description: 'Spróbuj ponownie później',
    });
  } finally {
    setIsLoading(false);
  }
}

interface HandlePasswordSubmitProps {
  email: string;
  password: string;
  form: UseFormReturn<z.infer<typeof signInSchema>>;
  setIsLoading: (loading: boolean) => void;
  router: AppRouterInstance;
}

export async function handlePasswordSubmit({
  email,
  password,
  setIsLoading,
  form,
  router,
}: HandlePasswordSubmitProps): Promise<void> {
  if (!password) return;

  setIsLoading(true);
  try {
    await authClient.signIn.email(
      {
        email,
        password: password,
        callbackURL: '/movies',
      },

      {
        onSuccess: () => {
          toast.success('Zalogowano pomyślnie', {
            description: 'Przekierowanie do strony głównej',
          });
        },
        onError: (ctx: ErrorContext) => {
          toast.error('Problemy z logowaniem?', {
            description: 'Kliknij, aby zresetować hasło',
            duration: 10000,
            action: {
              label: 'Zmień hasło ↗',
              onClick: () => {
                router.push('/forgot-password');
              },
            },
          });
          form.setError('password', {
            type: 'manual',
            message:
              ctx.error.message === 'Invalid email or password'
                ? 'Nieprawidłowe dane logowania'
                : 'Wystąpił błąd podczas logowania',
          });
        },
      }
    );
  } catch (error) {
    console.error('Sign-in error:', error);
    form.setError('password', {
      type: 'manual',
      message: 'Wystąpił błąd podczas logowania',
    });
  } finally {
    setIsLoading(false);
  }
}

export async function handleGoogleSignIn(): Promise<void> {
  await authClient.signIn.social(
    {
      provider: 'google',
      callbackURL: '/movies',
    },
    {
      onError: (ctx: ErrorContext) => {
        console.log(ctx);
      },
    }
  );
}
