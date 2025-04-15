import { NextRequest, NextResponse } from 'next/server';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
  },
};

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  if (!process.env.API_ACCESS_TOKEN) {
    console.error('API_ACCESS_TOKEN is not defined in environment variables.');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    console.log(id);
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/${id}?language=pl`,
      options
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' + error },
      { status: 500 }
    );
  }
}
