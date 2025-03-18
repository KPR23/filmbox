import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email)
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  try {
    const employee = await prisma.user.findUnique({
      where: { email },
    });

    if (!employee) return NextResponse.json({ error: 'Employee not found' });

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
