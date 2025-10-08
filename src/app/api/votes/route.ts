import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { titleId } = await request.json();

    if (!titleId) {
      return NextResponse.json(
        { error: 'Title ID is required' },
        { status: 400 },
      );
    }

    // Check if user already voted for this title
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_titleId: {
          userId: session.user.id,
          titleId: titleId,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this title' },
        { status: 409 },
      );
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        titleId: titleId,
      },
    });

    return NextResponse.json({ success: true, vote });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
