'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { set, z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import LoadingButton from '@/components/loading-button';
import { signUpSchema } from '@/lib/zod';
import { authClient } from '@/auth/auth-client';
import { Check } from 'lucide-react';
import { error } from 'console';

export default function SignUp() {
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
          toast.success('Konto zostało utworzone!', {
            description:
              'Aby aktywować konto, kliknij link w wiadomości, którą właśnie wysłaliśmy. Wiadomość mogła trafić do spamu.',
          });
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
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Utwórz konto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {['name', 'email', 'password', 'confirmPassword'].map((field) => (
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
              ))}
              <LoadingButton pending={pending}>Sign up</LoadingButton>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href="/sign-in" className="text-primary hover:underline">
              Masz już konto?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
