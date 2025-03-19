'use client';

import { forgotPasswordSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { authClient } from '@/auth/auth-client';
import { toast } from 'sonner';

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

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      toast.error(error.message, {
        description: 'Spróbuj ponownie później',
      });
    } else {
      toast.success('E-mail z linkiem do zmiany hasła został wysłany', {
        description: 'Sprawdź swoją skrzynkę e-mail',
      });
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
    </div>
  );
}
