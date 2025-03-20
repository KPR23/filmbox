'use server';

import { PrismaClient } from '@prisma/client';

export async function checkEmail(email: string) {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return !!user;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
