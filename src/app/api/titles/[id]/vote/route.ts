import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Simulando dados de votos em memória (será substituído pelo banco de dados)
const mockVotes: {
  [titleId: string]: {
    ratings: number[];
    userVotes: { [userId: string]: number };
  };
} = {};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      );
    }

    // Initialize mock votes if not exists
    if (!mockVotes[id]) {
      mockVotes[id] = { ratings: [], userVotes: {} };
    }

    // Check if user already voted
    const previousVote = mockVotes[id].userVotes[session.user.email];

    if (previousVote) {
      // Update existing vote - remove old rating first
      const oldIndex = mockVotes[id].ratings.indexOf(previousVote);
      if (oldIndex > -1) {
        mockVotes[id].ratings.splice(oldIndex, 1);
      }
    }

    // Add new vote (always add, even if updating)
    mockVotes[id].ratings.push(rating);

    // Update user vote
    mockVotes[id].userVotes[session.user.email] = rating;

    // Calculate new average
    const ratings = mockVotes[id].ratings;
    const averageRating =
      ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;

    console.log(
      `Vote registered for title ${id}: rating=${rating}, total votes=${
        ratings.length
      }, average=${averageRating.toFixed(1)}`,
    );

    return NextResponse.json({
      success: true,
      userVote: rating,
      averageRating,
      totalVotes: ratings.length,
    });
  } catch (error) {
    console.error('Vote API error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
