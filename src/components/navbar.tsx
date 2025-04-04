'use client';

import Link from 'next/link';
import { SessionData } from '@/lib/types';
import { usePathname } from 'next/navigation';
import SignOutButton from './signout-button';
import { Input } from './ui/input';
import { Search, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavbarProps {
  session: SessionData | null;
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center py-4 px-8 border-b">
      <div className="flex items-center gap-16">
        <Link href="/movies" className="text-xl font-semibold">
          Filmbox
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/movies"
            className={`font-medium transition-colors ${
              pathname === '/movies'
                ? 'text-primary'
                : 'text-muted-foreground/70 hover:text-muted-foreground'
            }`}
          >
            Filmy
          </Link>
          <Link
            href="/favorites"
            className={`font-medium transition-colors ${
              pathname === '/favorites'
                ? 'text-primary'
                : 'text-muted-foreground/70 hover:text-muted-foreground'
            }`}
          >
            Ulubione
          </Link>
          <Link
            href="/watchlist"
            className={`font-medium transition-colors ${
              pathname === '/watchlist'
                ? 'text-primary'
                : 'text-muted-foreground/70 hover:text-muted-foreground'
            }`}
          >
            Do obejrzenia
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-64 relative">
          <Search className="w-4 h-4 text-muted-foreground/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Szukaj filmów, seriali..."
            className="w-64 relative pl-9"
          />
        </div>
        <Button variant="outline" className="size-9 p-0">
          <Users className="w-4 h-4" />
        </Button>
        {!session ? (
          <Link
            href="/login"
            className="font-medium text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            Zaloguj się
          </Link>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user.image} />
            <AvatarFallback>
              {session.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </nav>
  );
}
