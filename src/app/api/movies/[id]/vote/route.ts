import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Avaliação deve ser entre 1 e 5 estrelas' },
        { status: 400 },
      );
    }

    if (!mockVotes[id]) {
      mockVotes[id] = { ratings: [], userVotes: {} };
    }

    const previousVote = mockVotes[id].userVotes[session.user.email];

    if (previousVote) {
      const oldIndex = mockVotes[id].ratings.indexOf(previousVote);
      if (oldIndex > -1) {
        mockVotes[id].ratings.splice(oldIndex, 1);
      }
    }

    mockVotes[id].ratings.push(rating);
    mockVotes[id].userVotes[session.user.email] = rating;

    const ratings = mockVotes[id].ratings;
    const averageRating =
      ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;

    return NextResponse.json({
      success: true,
      userVote: rating,
      averageRating,
      totalVotes: ratings.length,
    });
  } catch (error) {
    console.error('Error updating vote:', error);
    return NextResponse.json(
      { error: 'Falha ao registrar voto' },
      { status: 500 },
    );
  }
}
