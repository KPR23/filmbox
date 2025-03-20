import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email)
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.emailVerified) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'User not verified' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
