import { useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Movie } from '@/lib/types';
import Image from 'next/image';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const query = searchParams.get('query')?.toString() || '';
    setSearchTerm(query);
  }, [searchParams]);

  const handleSearch = useCallback(async (term: string) => {
    if (!term) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setIsVisible(true);

    try {
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(term)}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(`Failed to fetch results. Please try again. ${err}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    } else {
      setResults([]);
      setHasSearched(false);
      setError(null);
    }
  }, [debouncedSearchTerm, handleSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputFocus() {
    if (searchTerm) {
      setIsVisible(true);
      if (!hasSearched) {
        handleSearch(searchTerm);
      }
    }
  }

  const showResults =
    isVisible &&
    (loading ||
      results.length > 0 ||
      (hasSearched && results.length === 0 && searchTerm));

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="w-4 h-4 text-muted-foreground/70 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder={placeholder}
          className="w-64 relative pl-9"
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          value={searchTerm}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isVisible}
          role="combobox"
          aria-activedescendant=""
        />
      </div>

      {showResults && (
        <div
          id="search-results"
          role="listbox"
          className="absolute mt-1 w-full bg-background border rounded-md shadow-lg z-10 max-h-80 overflow-y-auto"
        >
          {loading && (
            <p className="p-4 text-sm text-muted-foreground">Loading...</p>
          )}

          {error && <p className="p-4 text-sm text-red-600">{error}</p>}

          {!loading && !error && results.length === 0 && hasSearched && (
            <p className="p-4 text-sm text-muted-foreground">
              No results found for &quot;{searchTerm}&quot;
            </p>
          )}

          {!loading &&
            !error &&
            results.map((movie) => (
              <Link
                href={`/movies/${movie.id}`}
                key={movie.id}
                className="block p-2 hover:bg-accent"
                role="option"
                onClick={() => {
                  setResults([]);
                  setHasSearched(false);
                  setIsVisible(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-xs"
                      width={40}
                      height={56}
                    />
                  ) : (
                    <div className="w-10 h-14 bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">X</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{movie.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {movie.release_date?.split('-')[0] || ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
