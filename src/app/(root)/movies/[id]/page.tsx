'use client';
import { Movie } from '@/lib/types';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Alert from '@/components/alert';
export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/movies/${id}`
        );
        if (!response.ok) {
          setError('Nie udało się załadować filmu');
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
        setError('Nie udało się załadować filmu');
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !movie) {
    return (
      <Alert
        title="Błąd 😖"
        message={error || 'Nie udało się załadować filmu'}
        redirectTo="/movies"
        redirectText="Wróć do strony głównej"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {movie.poster_path && (
          <div className="relative h-[450px] w-full">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-600 mb-6">{movie.overview}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold mb-2">Details</h2>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-600">Director:</span>{' '}
                  {movie.credits?.crew?.find(
                    (member) => member.job === 'Director'
                  )?.name || 'Unknown'}
                </li>
                <li>
                  <span className="text-gray-600">Release Date:</span>{' '}
                  {movie.release_date}
                </li>
                <li>
                  <span className="text-gray-600">Duration:</span>{' '}
                  {movie.runtime} minutes
                </li>
                <li>
                  <span className="text-gray-600">Rating:</span>{' '}
                  {movie.vote_average}
                  /10
                </li>
                <li>
                  <span className="text-gray-600">Language:</span>{' '}
                  {movie.original_language}
                </li>
                <li>
                  <span className="text-gray-600">Country:</span>{' '}
                  {movie.production_countries?.[0]?.name || 'Unknown'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h2 className="font-semibold mt-4 mb-2">Cast</h2>
              <div className="flex flex-wrap gap-2">
                {movie.credits?.cast?.slice(0, 10).map((actor) => (
                  <span
                    key={actor.name}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {actor.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Financial</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Budget:</span> $
                {movie.budget.toLocaleString()}
              </div>
              <div>
                <span className="text-gray-600">Revenue:</span> $
                {movie.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
