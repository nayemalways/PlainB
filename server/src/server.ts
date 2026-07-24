import mongoose from 'mongoose';
import type { Server } from 'node:http';
import app from './app.ts';
import { seedAdmin } from './app/utility/seedAdmin.ts';
import { env } from './app/config/config.ts';
import { connectRedis, disconnectRedis } from './app/config/redis.config.ts';

let server: Server | undefined;

const bootstrap = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log('Database Connected!');
    await connectRedis();
    console.log('Redis Connected!');

    await seedAdmin();

    server = app.listen(env.PORT, () =>
      console.log(`App running on http://localhost:${env.PORT}`),
    );
    console.log('Server started');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

bootstrap();

let shuttingDown = false;
const shutdown = async (exitCode: number) => {
  if (shuttingDown) return;
  shuttingDown = true;

  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  }
  await Promise.allSettled([disconnectRedis(), mongoose.disconnect()]);
  process.exit(exitCode);
};

process.on('SIGTERM', () => void shutdown(0));
process.on('SIGINT', () => void shutdown(0));
process.on('unhandledRejection', (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`Unhandled rejection detected: ${message}`);
  void shutdown(1);
});
process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught exception detected: ${error.message}`);
  void shutdown(1);
});
