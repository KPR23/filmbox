'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ErrorContext } from '@better-fetch/fetch';

import { cn } from '@/lib/utils';
import { signInSchema } from '@/lib/zod';
import { checkEmail } from '@/actions/email-check';
import { authClient } from '@/auth/auth-client';
import { userDetailsSchema } from '@/lib/userSchema';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onEmailSubmit(data: { email: string }) {
    setIsLoading(true);

    try {
      const emailExists = await checkEmail(data.email);

      if (emailExists) {
        const response = await fetch(`/api/user/email?email=${data.email}`);
        const userData = await response.json();

        const parsedUserDetails = userDetailsSchema.parse(userData);

        if (parsedUserDetails.emailVerified) {
          const firstName = parsedUserDetails.name.split(' ')[0];
          setName(firstName);
          setEmail(data.email);
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

  async function onPasswordSubmit(data: { password: string }) {
    if (!data.password) return;

    setIsLoading(true);
    try {
      await authClient.signIn.email(
        {
          email,
          password: data.password,
          callbackURL: '/movies',
        },
        {
          onSuccess: () => {
            router.push('/movies');
            router.refresh();
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (showPassword) {
      const password = form.getValues('password');
      if (password) onPasswordSubmit({ password });
    } else {
      const email = form.getValues('email');
      if (email) onEmailSubmit({ email });
    }
  }

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: 'google',
      },
      {
        onSuccess: () => {
          router.push('/movies');
          router.refresh();
          toast.success('Zalogowano pomyślnie', {
            description: 'Przekierowanie do strony głównej',
          });
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx);
          toast.error('Wystąpił błąd podczas logowania', {
            description: 'Spróbuj ponownie później',
          });
        },
      }
    );
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center justify-center">
          <CardTitle className="text-2xl">
            {showPassword ? `Witaj ponownie, ${name} 👋🏻` : 'Zaloguj się'}
          </CardTitle>
          <CardDescription>
            {showPassword
              ? 'Wprowadź hasło, aby się zalogować'
              : 'Wprowadź swój e-mail, aby kontynuować'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="login-form"
              name="login"
              method="post"
              autoComplete="on"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">E-mail</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            autoFocus={!showPassword}
                            disabled={showPassword}
                            autoComplete="username email"
                            {...field}
                            className={cn(
                              form.formState.errors.email
                                ? 'border-destructive'
                                : 'border-input',
                              'rounded-md p-2 text-sm focus:ring'
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {showPassword && (
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel htmlFor="password">Hasło</FormLabel>
                            <a
                              href="/forgot-password"
                              className="ml-auto inline-block text-sm underline-offset-4 text-muted-foreground hover:underline"
                            >
                              Zapomniałeś hasła?
                            </a>
                          </div>
                          <FormControl>
                            <Input
                              id="password"
                              type="password"
                              required
                              autoFocus
                              autoComplete="current-password"
                              {...field}
                              className={cn(
                                'border',
                                form.formState.errors.password
                                  ? 'border-destructive'
                                  : 'border-input',
                                'rounded-md p-2 text-sm focus:ring'
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full relative cursor-pointer"
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isLoading && (
                      <Loader2 className="absolute justify-center h-4 w-4 animate-spin" />
                    )}

                    <span
                      className={cn(
                        'transition-all duration-200',
                        showPassword
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-1 opacity-0'
                      )}
                    >
                      {isLoading ? '' : 'Zaloguj się'}
                    </span>

                    <span
                      className={cn(
                        'absolute transition-all duration-200',
                        !showPassword
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-1 opacity-0'
                      )}
                    >
                      {isLoading ? '' : 'Dalej'}
                    </span>
                  </div>
                </Button>
              </div>
              <div className="relative text-center w-full text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative w-full z-10 bg-card px-2 text-muted-foreground">
                  lub
                </span>
              </div>
              {!showPassword && (
                <>
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full relative"
                    type="button"
                  >
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="left-3 absolute"
                    />
                    Zaloguj się z Google
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Nie masz konta?{' '}
                    <Link
                      href="/signup"
                      className="underline text-primary underline-offset-4 after:content-['_↗']"
                    >
                      Zarejestruj się
                    </Link>
                  </div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
