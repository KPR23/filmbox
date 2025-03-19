'use client';

import { resetPasswordSchema } from '@/lib/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Suspense, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/auth/auth-client';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
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
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: data.password,
    });

    if (error) {
      toast.error(error.message || 'Wystąpił błąd', {
        description: 'Spróbuj ponownie później',
      });
    } else {
      toast.success('Hasło zostało zmienione', {
        description: 'Zaloguj się ponownie',
        action: {
          label: 'Zaloguj się',
          onClick: () => router.push('/login'),
        },
      });
      router.push('/login');
    }
    setIsPending(false);
  };

  if (error === 'invalid_token') {
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
                      Wyślij nowy link resetujący
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
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Zresetuj hasło
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <LoadingButton pending={isPending}>Zresetuj hasło</LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
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
