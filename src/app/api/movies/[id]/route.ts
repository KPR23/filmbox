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
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}`,
      options
    );

    if (!response.ok) {
      console.error('HTTP error:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
