'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  LogOut,
  Home,
  Film,
  BarChart3,
  UserCircle,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

export function Navigation() {
  const { data: session } = useSession();
  const [isGenresOpen, setIsGenresOpen] = useState(false);

  const genres = [
    { key: 'action', label: 'Ação' },
    { key: 'adventure', label: 'Aventura' },
    { key: 'animation', label: 'Animação' },
    { key: 'comedy', label: 'Comédia' },
    { key: 'crime', label: 'Crime' },
    { key: 'drama', label: 'Drama' },
    { key: 'fantasy', label: 'Fantasia' },
    { key: 'horror', label: 'Terror' },
    { key: 'mystery', label: 'Mistério' },
    { key: 'romance', label: 'Romance' },
    { key: 'thriller', label: 'Thriller' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-orange-600">
                Up<span className="text-gray-900">Screen</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <Home size={16} />
              Início
            </Link>

            {session && (
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <BarChart3 size={16} />
                Dashboard
              </Link>
            )}

            {session && (
              <Link
                href="/profile"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <UserCircle size={16} />
                Perfil
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setIsGenresOpen(!isGenresOpen)}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
              >
                <Film size={16} />
                Catálogo
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    isGenresOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isGenresOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-50">
                  <div className="py-1">
                    <Link
                      href="/catalog"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsGenresOpen(false)}
                    >
                      Todos os Gêneros
                    </Link>
                    {genres.map((genre) => (
                      <Link
                        key={genre.key}
                        href={`/catalog?genre=${genre.key}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsGenresOpen(false)}
                      >
                        {genre.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-72">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900 hidden md:block">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-gray-700 p-2"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <User size={16} />
                Entrar
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center justify-center py-2">
          <div className="w-full max-w-md">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
