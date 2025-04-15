'use server';

import prisma from './prisma';

export async function getUserData(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}
