'use client';
import { Movie } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const filters = [
    {
      label: 'Najnowsze',
      value: 'latest',
    },
    {
      label: 'Popularne',
      value: 'popular',
    },
    {
      label: 'Najlepiej oceniane',
      value: 'top_rated',
    },
  ];

  const [activeFilter, setActiveFilter] = useState(filters[0].value);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/movies`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMovies(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || 'An error occurred while fetching movies.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="bg-destructive/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-destructive">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Filmy</h1>
      <div className="flex gap-2 mb-8">
        {filters.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'secondary'}
            className="rounded-full cursor-pointer h-8"
          >
            <Link
              onClick={() => setActiveFilter(filter.value)}
              href={`/movies?filter=${filter.value}`}
            >
              {filter.label}
            </Link>
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
            <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-xl p-0 pb-6 relative">
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 "
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">
                  {movie.title}
                </CardTitle>
                <Badge
                  className="flex items-center justify-center rounded-full absolute top-2 right-2"
                  variant="secondary"
                >
                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {movie.release_date.split('-')[0] || 'Nieznana'}
                </span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
