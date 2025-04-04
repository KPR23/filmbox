'use client';

import Link from 'next/link';
import { SessionData } from '@/lib/types';
import { usePathname } from 'next/navigation';
import SignOutButton from './signout-button';
import { Input } from './ui/input';
import { ChevronDown, Search, User, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="justify-center rounded-lg text-sm h-9 inline-flex items-center border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-2 cursor-pointer gap-2">
                <div className="flex items-center">
                  <Avatar className="w-6 h-6 ">
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="px-2 ">{session.user.name}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <span className="text-muted-foreground/70 text-sm">
                  {session.user.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Wyloguj się</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
