import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const [titles, totalCount] = await Promise.all([
      prisma.title.findMany({
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          votes: {
            _count: 'desc',
          },
        },
      }),
      prisma.title.count(),
    ]);

    const formattedTitles = titles.map((title) => ({
      id: title.id,
      name: title.name,
      description: title.description,
      genre: title.genre,
      imageUrl: title.imageUrl,
      voteCount: title._count.votes,
    }));

    return NextResponse.json({
      titles: formattedTitles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching titles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
