import { NextRequest, NextResponse } from 'next/server';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
  },
};

// Getting all movies
export async function GET() {
  if (!process.env.API_ACCESS_TOKEN) {
    console.error('API_ACCESS_TOKEN is not defined in environment variables.');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular',
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

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { title, tmdbId, imageUrl, rating } = body;

//     if (!title || !tmdbId) {
//       return NextResponse.json(
//         { error: 'Title and tmdbId are required' },
//         { status: 400 }
//       );
//     }

//     // const result =
//   } catch {}
// }
