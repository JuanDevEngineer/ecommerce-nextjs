import { PrismaClient } from '@prisma/client';
import sampleData from '@/mock/data';

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products,
  });

  await prisma.$disconnect();

  console.log('Seed data complete successfully');
}

main();
