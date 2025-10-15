import { PrismaClient } from '@prisma/client';

declare global {
  // Avoids redeclaration errors by extending globalThis
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;
