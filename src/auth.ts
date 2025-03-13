import { betterAuth, BetterAuthOptions } from 'better-auth';
import prisma from '@/lib/prisma';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
} satisfies BetterAuthOptions);
