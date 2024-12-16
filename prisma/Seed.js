// prisma/Seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGenres() {
  const genres = ['Action', 'Aventure', 'RPG', 'Simulation', 'Stratégie', 'Sport', 'Puzzle']; // Liste des genres par défaut

  for (const genre of genres) {
    const existingGenre = await prisma.genre.findUnique({
      where: { nom: genre },
    });

    if (!existingGenre) {
      await prisma.genre.create({
        data: { nom: genre },
      });
      console.log(`Genre ${genre} créé.`);
    }
  }
}

async function main() {
  await seedGenres();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });