import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

/**
 * `env('DATABASE_URL')` throws when the variable is unset, which broke
 * `prisma generate` on any machine without a database — including CI and the
 * Vercel build, where .env is not present. The whole point of this app is that
 * it renders from src/content when there is no database, so the config falls
 * back to the same placeholder the .env template carries. `db push` and
 * `db seed` still use the real URL whenever one is configured.
 */
const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/mastana?schema=public';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    seed: 'node prisma/seed.mjs',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
