'use server';

import { EmailData, ApiError } from '@/lib/types';
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}
if (!process.env.SENDGRID_FROM_EMAIL) {
  throw new Error('Email from environment variable is not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
}: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const message = {
      to: to.toLowerCase().trim(),
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: subject.trim(),
      text: text.trim(),
    };

    const [response] = await sgMail.send(message);

    if (response.statusCode !== 202) {
      throw new Error(
        `SendGrid API returned status code ${response.statusCode}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Wystąpił błąd podczas wysyłania emaila',
    };
  }
}

export async function handleEmailError(error: unknown): Promise<ApiError> {
  console.error('Email error:', error);

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: 'Wystąpił nieoczekiwany błąd podczas wysyłania emaila',
    status: 500,
  };
}
