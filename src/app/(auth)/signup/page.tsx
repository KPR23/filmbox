'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { signUpSchema } from '@/lib/zod';
import { authClient } from '@/auth/auth-client';
import LoadingButton from '@/components/loading-button';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const polishErrorMessages = {
    'User already exists': 'Użytkownik o takim adresie e-mail już istnieje.',
    'Invalid email format': 'Nieprawidłowy format adresu e-mail.',
    'Password must be at least 8 characters':
      'Hasło musi mieć co najmniej 8 znaków.',
    'Failed to send verification email':
      'Nie udało się wysłać wiadomości z linkiem weryfikacyjnym.',
    default: 'Wystąpił nieznany błąd. Spróbuj ponownie później.',
  };

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setPending(true);
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onSuccess: () => {
          setPending(false);
          toast.success('Konto zostało utworzone', {
            description:
              'Aktywuj konto klikając w link weryfikacyjny wysłany na Twój adres e-mail',
            duration: 10000,
          });
          router.push('/login');
        },
        onError: (ctx) => {
          setPending(false);
          console.log('error', ctx);
          toast.error('Coś poszło nie tak ', {
            description:
              polishErrorMessages[
                ctx.error.message as keyof typeof polishErrorMessages
              ] || polishErrorMessages.default,
          });
        },
      }
    );
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center justify-center">
              <CardTitle className="text-2xl">Utwórz konto ✨</CardTitle>
              <CardDescription>
                Wprowadź swoje dane, aby utworzyć konto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {['name', 'email', 'password', 'confirmPassword'].map(
                    (field) => (
                      <FormField
                        control={form.control}
                        key={field}
                        name={field as keyof z.infer<typeof signUpSchema>}
                        render={({ field: fieldProps }) => (
                          <FormItem>
                            <FormLabel>
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type={
                                  field.includes('password')
                                    ? 'password'
                                    : field === 'email'
                                    ? 'email'
                                    : 'text'
                                }
                                placeholder={`Enter your ${field}`}
                                {...fieldProps}
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                  )}
                  <LoadingButton
                    className="w-full"
                    type="submit"
                    isLoading={pending}
                  >
                    Utwórz konto
                  </LoadingButton>
                  <div className="text-center text-sm text-muted-foreground">
                    Masz już konto?{' '}
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
