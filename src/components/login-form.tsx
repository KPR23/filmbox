'use client';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signInSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useState } from 'react';
import { checkEmail } from '@/actions/email-check';
import { authClient } from '@/auth/auth-client';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onEmailSubmit(data: { email: string }) {
    setIsLoading(true);
    console.log('onEmailSubmit started, email:', data.email);

    try {
      const emailExists = await checkEmail(data.email);
      console.log('emailExists:', emailExists);

      if (emailExists) {
        console.log('Email exists, fetching user details');

        const userDetails = await fetch(
          `/api/user/email?email=${data.email}`
        ).then((res) => res.json());

        setName(userDetails.name.slice(0, userDetails.name.indexOf(' ')));
        setEmail(data.email);
        setShowPassword(true);
      } else {
        form.setError('email', {
          type: 'manual',
          message: 'Nie znaleziono użytkownika o takim adresie e-mail',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(data: { password: string }) {
    console.log('=== onPasswordSubmit started ===');
    console.log('Password provided:', !!data.password);
    console.log('Email stored in state:', email);

    if (!data.password) {
      console.log('Password is empty, returning early');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email });

      console.log('About to call authClient.signIn.email');
      const result = await authClient.signIn.email({
        email,
        password: data.password,
        callbackURL: '/movies',
      });

      console.log('Sign-in result type:', typeof result);
      console.log('Sign-in result:', JSON.stringify(result, null, 2));

      // Try using the full result object directly
      if (result) {
        console.log('Result exists, checking properties');

        if ('redirect' in result && result.redirect) {
          console.log('Found redirect property, redirecting to /movies');
          window.location.href = '/movies';
          return;
        }

        if ('url' in result && result.url) {
          console.log('Found url property, redirecting to:', result.url);
          window.location.href = result.url as string;
          return;
        }

        // Additional checks for other possible response formats
        if ('ok' in result && result.ok) {
          console.log('Found ok:true property, redirecting to /movies');
          window.location.href = '/movies';
          return;
        }
      }

      console.log('Login did not redirect, showing error');
      form.setError('password', {
        type: 'manual',
        message: 'Nieprawidłowe hasło',
      });
    } catch (error) {
      console.error('Sign-in error details:', error);
      form.setError('password', {
        type: 'manual',
        message: 'Wystąpił błąd podczas logowania',
      });
    } finally {
      setIsLoading(false);
      console.log('=== onPasswordSubmit completed ===');
    }
  }

  const { pendingCredentials } = { pendingCredentials: false };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
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
              onSubmit={(e) => {
                e.preventDefault();
                if (showPassword) {
                  const password = form.getValues('password');
                  if (password) {
                    onPasswordSubmit({ password });
                  }
                } else {
                  const email = form.getValues('email');
                  if (email) {
                    onEmailSubmit({ email });
                  }
                }
              }}
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
                            autoComplete="email"
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
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                <div className="flex flex-col gap-3">
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
                  {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Nie masz konta?{' '}
                <Link
                  href="/signup"
                  className="underline underline-offset-4 after:content-['_↗']"
                >
                  Zarejestruj się
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
