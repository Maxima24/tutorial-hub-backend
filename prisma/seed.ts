import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users...');

  const users = [
    { name: 'Alice', email: 'alice@example.com', password: 'password1' },
    { name: 'Bob', email: 'bob@example.com', password: 'password2' },
    { name: 'Charlie', email: 'charlie@example.com', password: 'password3' },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        verified: true,
      },
    });
  }

  console.log('Users seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
