import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const votes = await prisma.vote.findMany({
      where: {
        userId: id,
      },
      include: {
        title: {
          select: {
            id: true,
            name: true,
            genre: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
