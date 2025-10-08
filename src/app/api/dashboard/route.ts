import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Top 10 titles for bar chart
    const topTitles = await prisma.title.findMany({
      include: {
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

    // Votes evolution over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const votesOverTime = await prisma.vote.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    // Group votes by day
    const votesByDay = votesOverTime.reduce((acc, vote) => {
      const date = vote.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + vote._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Generate array for chart
    const evolutionData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      evolutionData.push({
        date: dateStr,
        votes: votesByDay[dateStr] || 0,
      });
    }

    // Genre distribution by total votes per genre
    const genreDistribution = await prisma.title.findMany({
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    const genreVotes = genreDistribution.reduce((acc, title) => {
      acc[title.genre] = (acc[title.genre] || 0) + title._count.votes;
      return acc;
    }, {} as Record<string, number>);

    const genreData = Object.entries(genreVotes).map(([genre, votes]) => ({
      name: genre,
      value: votes,
    }));

    // Total statistics
    const totalTitles = await prisma.title.count();
    const totalVotes = await prisma.vote.count();
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      topTitles: topTitles.map((title) => ({
        name: title.name,
        votes: title._count.votes,
      })),
      votesEvolution: evolutionData,
      genreDistribution: genreData,
      totalStats: {
        totalTitles,
        totalVotes,
        totalUsers,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
