'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface UserVote {
  id: string;
  createdAt: string;
  title: {
    id: string;
    name: string;
    genre: string;
    imageUrl: string;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [votes, setVotes] = useState<UserVote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserVotes() {
      if (status === 'loading') return;
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${session.user.id}/votes`);
        if (response.ok) {
          const data = await response.json();
          setVotes(data);
        }
      } catch (error) {
        console.error('Error fetching user votes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserVotes();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 rounded-lg h-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your profile
          </h1>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-6">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {session.user.name || 'Anonymous User'}
            </h1>
            <p className="text-gray-600">{session.user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star size={16} className="text-yellow-500" />
                <span>{votes.length} votes cast</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar size={16} />
                <span>
                  Joined{' '}
                  {new Date(session.user.email ? '2024' : '').getFullYear() ||
                    'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voting History */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Voting History
        </h2>

        {votes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Star size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No votes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start voting for your favorite movies and TV series!
            </p>
            <Link
              href="/titles"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Browse Titles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {votes.map((vote) => (
              <div
                key={vote.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/titles/${vote.title.id}`}>
                  <div className="cursor-pointer">
                    {vote.title.imageUrl ? (
                      <img
                        src={vote.title.imageUrl}
                        alt={vote.title.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Star className="text-gray-400" size={48} />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/titles/${vote.title.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {vote.title.name}
                    </h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {vote.title.genre}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>
                        {new Date(vote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
