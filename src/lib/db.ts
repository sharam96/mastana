import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma is optional at runtime. When DATABASE_URL is absent the site still
 * renders from the versioned catalogue and writes enquiries to a local file,
 * so a missing database degrades gracefully instead of breaking the build.
 */
const connectionString = process.env.DATABASE_URL;

/** A placeholder URL from .env.example must not count as a configured database. */
export const databaseEnabled =
  Boolean(connectionString) && !connectionString!.includes('user:password@localhost');

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient | null };

function createClient(): PrismaClient | null {
  if (!databaseEnabled) return null;
  try {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  } catch {
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma !== undefined ? globalForPrisma.prisma : createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
