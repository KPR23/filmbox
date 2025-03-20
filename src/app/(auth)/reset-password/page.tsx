'use client';

import { resetPasswordSchema } from '@/lib/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/auth/auth-client';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const token = searchParams.get('token');
  const [isPending, setIsPending] = useState(false);
  const [tokenError, setTokenError] = useState<boolean>(false);

  const isValidToken = Boolean(token && token.length > 10);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true);

    if (!token) {
      setTokenError(true);
      setIsPending(false);
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (error) {
      if (
        error.message &&
        typeof error.message === 'string' &&
        (error.message.toLowerCase().includes('token') ||
          error.message.toLowerCase().includes('invalid'))
      ) {
        setTokenError(true);
      } else {
        toast.error(error.message || 'Wystąpił błąd', {
          description: 'Spróbuj ponownie później',
        });
      }
    } else {
      toast.success('Hasło zostało zmienione', {
        description: 'Teraz możesz się zalogować',
      });
      router.push('/login');
    }
    setIsPending(false);
  };

  if (error === 'invalid_token' || tokenError || !isValidToken) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center justify-center">
                <CardTitle className="text-2xl">Kurza twarz 😟</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Wygląda na to, że Twój link do zmiany hasła jest
                    nieprawidłowy lub wygasł.
                  </p>
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={() => router.push('/forgot-password')}
                      className="w-full"
                    >
                      Wyślij nowy link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center justify-center">
              <CardTitle className="text-2xl">Ustaw nowe hasło 🔏</CardTitle>
              <CardDescription>
                Wpisz nowe hasło, którym będziesz się logował
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nowe hasło</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Wpisz nowe hasło"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potwierdź nowe hasło</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Potwierdź nowe hasło"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <LoadingButton pending={isPending}>
                    Zresetuj hasło
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
