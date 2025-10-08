import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topTitles = await prisma.title.findMany({
      include: {
        votes: true,
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const formattedTitles = topTitles.map((title) => ({
      id: title.id,
      name: title.name,
      description: title.description,
      genre: title.genre,
      imageUrl: title.imageUrl,
      voteCount: title._count.votes,
    }));

    return NextResponse.json(formattedTitles);
  } catch (error) {
    console.error('Error fetching top titles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
