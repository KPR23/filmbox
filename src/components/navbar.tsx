'use client';

import type { User } from '@/lib/types';
import Link from 'next/link';
import { Session } from '@/auth/auth';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LifeBuoy,
  LogOut,
  Settings,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import AvatarComponent from './avatar';
import { authClient } from '@/auth/auth-client';
import { useRouter } from 'next/navigation';
import { Search } from './search';
import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/queries';

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.id) {
        try {
          const data = await getUserData(session.user.id);
          if (data) {
            setUserData(data as User);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }
    fetchUser();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login');
          },
        },
      });
    } catch (error) {
      console.log('Error while signing out', error);
    }
  };

  const userTag = userData?.tag || 'Brak tagu';

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
          <Search placeholder="Szukaj filmów..." />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="size-9 p-0">
              <Bell className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Powiadomienia</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="justify-center rounded-lg text-sm h-9 inline-flex items-center border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-2 cursor-pointer gap-2">
                <div className="flex items-center">
                  <AvatarComponent
                    src={session.user.image || ''}
                    name={session.user.name || ''}
                  />
                  <span className="px-2 ">{session.user.name}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/profile">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Profil
                    <span className="text-muted-foreground/70 text-sm">
                      @{userTag}
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/friends">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Znajomi
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings">
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Ustawienia
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/help">
                  <span className="flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4" />
                    Centrum pomocy
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Wyloguj się
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
