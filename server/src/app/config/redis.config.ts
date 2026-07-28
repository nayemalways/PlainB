import { Redis, type RedisOptions } from 'ioredis';
import { env } from './config.ts';

export const createRedisConnection = (overrides: RedisOptions = {}) =>
  new Redis(env.REDIS_URL, {
    connectTimeout: 10_000,
    enableReadyCheck: true,
    lazyConnect: true,
    retryStrategy: (attempt) => Math.min(attempt * 200, 2_000),
    ...overrides,
  });

// Future BullMQ workers should create their own connection with
// createRedisConnection({ maxRetriesPerRequest: null }).
export const redis = createRedisConnection({
  maxRetriesPerRequest: 3,
});

redis.on('error', (error) => {
  console.error(`Redis connection error: ${error.message}`);
});

export const connectRedis = async () => {
  if (redis.status === 'wait') await redis.connect();
  await redis.ping();
};

export const disconnectRedis = async () => {
  if (redis.status !== 'end') await redis.quit();
};
