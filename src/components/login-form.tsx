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
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import LoadingButton from './loading-button';
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

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { pendingCredentials } = { pendingCredentials: false };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Zaloguj się </CardTitle>
          <CardDescription>
            Wprowadź swoje dane, aby kontynuować
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            autoFocus
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <>
                        <div className="flex items-center">
                          <Label htmlFor="password">Hasło</Label>
                          <a
                            href="/forgot-password"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Zapomniałeś hasła?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          {...field}
                        />
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <LoadingButton pending={pendingCredentials}>
                    Zaloguj się
                  </LoadingButton>
                  {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Nie masz konta?{' '}
                <Link
                  href="/sign-up"
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
