import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample titles
  const titles = [
    {
      name: 'Breaking Bad',
      description:
        "A high school chemistry teacher turned methamphetamine producer partners with a former student to secure his family's financial future.",
      genre: 'Drama',
      imageUrl:
        'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=600&fit=crop',
    },
    {
      name: 'The Godfather',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      genre: 'Drama',
      imageUrl:
        'https://images.unsplash.com/photo-1489599735522-40047885dc90?w=400&h=600&fit=crop',
    },
    {
      name: 'Inception',
      description:
        "A skilled thief is given the chance to have his criminal history erased as payment for implanting an idea in a CEO's mind.",
      genre: 'Sci-Fi',
      imageUrl:
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    },
    {
      name: 'The Dark Knight',
      description:
        'Batman faces his greatest challenge when the Joker wreaks havoc and chaos on the people of Gotham.',
      genre: 'Action',
      imageUrl:
        'https://images.unsplash.com/photo-1635863138275-d9864d528cd5?w=400&h=600&fit=crop',
    },
    {
      name: 'Game of Thrones',
      description:
        'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after millennia.',
      genre: 'Fantasy',
      imageUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    },
    {
      name: 'Stranger Things',
      description:
        'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
      genre: 'Horror',
      imageUrl:
        'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=600&fit=crop',
    },
    {
      name: 'Pulp Fiction',
      description:
        'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
      genre: 'Crime',
      imageUrl:
        'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=600&fit=crop',
    },
    {
      name: 'The Office',
      description:
        'A mockumentary on a group of typical office workers, where the workday consists of ego clashes and inappropriate behavior.',
      genre: 'Comedy',
      imageUrl:
        'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=600&fit=crop',
    },
    {
      name: 'Avatar',
      description:
        'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following orders and protecting an alien civilization.',
      genre: 'Sci-Fi',
      imageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    },
    {
      name: 'Friends',
      description:
        'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.',
      genre: 'Comedy',
      imageUrl:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
    },
  ];

  console.log('🌱 Starting seed...');

  // Delete existing data
  await prisma.vote.deleteMany();
  await prisma.title.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create titles
  for (const titleData of titles) {
    await prisma.title.create({
      data: titleData,
    });
  }

  console.log(`📚 Created ${titles.length} titles`);

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
