import { useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Movie } from '@/lib/types';
import Image from 'next/image';

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);

  async function handleSearch(term: string) {
    if (!term) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/movies/search?query=${term}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="w-4 h-4 text-muted-foreground/70 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder={placeholder}
          className="w-64 relative pl-9"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
      {results.length > 0 ? (
        <div className="absolute mt-1 w-full bg-background border rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
          {results.map((movie) => (
            <Link
              href={`/movies/${movie.id}`}
              key={movie.id}
              className="block p-2 hover:bg-accent"
              onClick={() => setResults([])}
            >
              <div className="flex items-center gap-2">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-10 h-14 object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-10 h-14 bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      No img
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {movie.release_date?.split('-')[0] || 'Unknown year'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="absolute mt-1 w-full bg-background border rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
          <p className="text-sm text-muted-foreground p-4">
            Brak wyników dla zapytania {searchParams.get('query')}
          </p>
        </div>
      )}
    </div>
  );
}
