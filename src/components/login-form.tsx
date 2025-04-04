'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, PencilLine } from 'lucide-react';

import { cn } from '@/lib/utils';
import { signInSchema } from '@/lib/zod';
import { checkEmailExistence } from '@/auth/actions';
import { authClient } from '@/auth/auth-client';
import { ErrorContext } from '@better-fetch/fetch';
import {
  LoginFormProps,
  SignInSchema,
  EmailCheckResponse,
  FormFieldName,
  SocialProvider,
} from '@/lib/types';

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
import LoadingButton from './loading-button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [revealedPassword, setRevealedPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const resetFieldError = (fieldName: FormFieldName) => {
    if (form.formState.errors[fieldName]) {
      form.clearErrors(fieldName);
    }
  };

  async function onEmailSubmit(data: { email: string }) {
    setIsLoading(true);
    if (!data.email) {
      form.setError('email', {
        type: 'manual',
        message: 'Email jest wymagany',
      });
      return;
    }

    try {
      const result: EmailCheckResponse = await checkEmailExistence(data.email);

      if (result.error) {
        form.setError('email', {
          type: 'manual',
          message: result.error,
        });
        return;
      }

      if (result.exists) {
        if (result.emailVerified) {
          const firstName = result.name?.split(' ')[0] || '';
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
          rememberMe: rememberMe,
        },
        {
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
        provider: 'google' as SocialProvider,
        callbackURL: '/movies',
      },
      {
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
      {/* {showPassword ? (
        <Button
          className="w-9 h-9"
          variant="outline"
          onClick={() => setShowPassword(false)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      ) : (
        ''
      )} */}
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
                        <div className="flex items-center justify-between h-6">
                          <FormLabel htmlFor="email">E-mail</FormLabel>
                          <div className="min-h-[1.5rem] flex items-center">
                            <FormMessage />
                          </div>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              required
                              autoFocus={!showPassword}
                              disabled={showPassword}
                              autoComplete="username email"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                resetFieldError('email');
                              }}
                              className={cn(
                                form.formState.errors.email
                                  ? 'border-destructive'
                                  : 'border-input',
                                'rounded-md p-2 text-sm focus:ring'
                              )}
                            />
                            {showPassword && (
                              <PencilLine
                                onClick={() => setShowPassword(false)}
                                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                              />
                            )}
                          </div>
                        </FormControl>
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
                          <div className="flex items-center justify-between h-6">
                            <FormLabel htmlFor="password">Hasło</FormLabel>
                            <div className="min-h-[1.5rem] flex items-center">
                              <FormMessage />
                            </div>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                type={revealedPassword ? 'text' : 'password'}
                                required
                                autoFocus
                                autoComplete="current-password"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  resetFieldError('password');
                                }}
                                className={cn(
                                  'border',
                                  form.formState.errors.password
                                    ? 'border-destructive'
                                    : 'border-input',
                                  'rounded-md p-2 text-sm focus:ring pr-10'
                                )}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                                {revealedPassword ? (
                                  <Eye
                                    className="h-4 w-4 text-muted-foreground"
                                    onClick={() => setRevealedPassword(false)}
                                  />
                                ) : (
                                  <EyeOff
                                    className="h-4 w-4 text-muted-foreground"
                                    onClick={() => setRevealedPassword(true)}
                                  />
                                )}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(
                              checked === 'indeterminate' ? false : checked
                            )
                          }
                        />
                        <Label htmlFor="rememberMe">Zapamiętaj mnie</Label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 text-muted-foreground hover:underline"
                      >
                        Zapomniałeś hasła?
                      </Link>
                    </div>
                  </div>
                )}

                <LoadingButton
                  type="submit"
                  className="w-full relative cursor-pointer"
                  isLoading={isLoading}
                >
                  <div className="flex items-center justify-center gap-2">
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
                </LoadingButton>
              </div>
              {!showPassword && (
                <>
                  <div className="relative text-center w-full text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative w-full z-10 bg-card px-2 text-muted-foreground">
                      lub
                    </span>
                  </div>
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
