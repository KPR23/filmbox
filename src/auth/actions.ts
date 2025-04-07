'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { EmailCheckResponse, ApiError } from '@/lib/types';

export async function checkEmailExistence(
  email: string
): Promise<EmailCheckResponse> {
  if (!email) {
    return {
      exists: false,
      error: 'E-mail jest wymagany',
    };
  }

  try {
    const emailSchema = z.string().email();
    let validatedEmail: string;

    try {
      validatedEmail = emailSchema.parse(email.toLowerCase().trim());
    } catch (error) {
      console.error('Invalid email format:', error);
      return {
        exists: false,
        error: 'Nieprawidłowy format adresu email',
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: validatedEmail },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    if (user) {
      return {
        exists: true,
        name: user.name,
        emailVerified: !!user.emailVerified,
      };
    } else {
      return {
        exists: false,
        error: 'Nie znaleziono użytkownika',
      };
    }
  } catch (error) {
    console.error('Email check error:', error);
    return {
      exists: false,
      error: 'Wystąpił błąd podczas sprawdzania adresu email',
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function handleAuthError(error: unknown): Promise<ApiError> {
  console.error('Auth error:', error);

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: 'Wystąpił nieoczekiwany błąd',
    status: 500,
  };
}
