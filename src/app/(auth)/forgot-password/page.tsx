'use client';

import { forgotPasswordSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { authClient } from '@/auth/auth-client';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);

    try {
      const { error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message, {
          description: 'Spróbuj ponownie później',
        });
      } else {
        toast.success('E-mail z linkiem do zmiany hasła został wysłany', {
          description: 'Sprawdź swoją skrzynkę pocztową',
        });
        form.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center justify-center">
              <CardTitle className="text-2xl">Zresetuj hasło 🔐</CardTitle>
              <CardDescription>
                Wprowadź swój e-mail, aby otrzymać link do zmiany hasła.
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between h-6">
                          <FormLabel htmlFor="email">E-mail</FormLabel>
                          <div className="min-h-[1.5rem] flex items-center">
                            <FormMessage />
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <LoadingButton
                    className="w-full"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Wyślij link
                  </LoadingButton>
                  <div className="text-center text-sm text-muted-foreground">
                    Pamiętasz swoje hasło?{' '}
                    <Link
                      href="/login"
                      className="underline text-primary underline-offset-4 after:content-['_↗']"
                    >
                      Zaloguj się
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
