import { betterAuth, BetterAuthOptions } from 'better-auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI } from 'better-auth/plugins';
import { getUserData } from '@/lib/queries';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const fetchedUser = await getUserData(user.id);

      if (!fetchedUser?.email) {
        throw new Error('User email not found');
      }
      await sendEmail({
        to: fetchedUser.email,
        subject: 'Zresetuj swoje hasło',
        text: `Kliknij link, aby zresetować swoje hasło: ${url}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const fetchedUser = await getUserData(user.id);

      if (!fetchedUser?.email) {
        throw new Error('User email not found');
      }
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendEmail({
        to: fetchedUser.email,
        subject: 'Weryfikacja adresu email',
        text: `Kliknij link, aby weryfikować swój adres email: ${verificationUrl}`,
      });
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  advanced: {
    cookies: {
      dont_remember: {
        name: 'better-auth.dont_remember',
        attributes: {
          maxAge: undefined,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        },
      },
      session_token: {
        name: 'better-auth.session_token',
        attributes: {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        },
      },
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
