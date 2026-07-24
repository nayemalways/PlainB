import { Redis, type RedisOptions } from 'ioredis';
import { env } from './config.ts';

export const createRedisConnection = (overrides: RedisOptions = {}) =>
  new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    ...overrides,
  });

// Future BullMQ workers should create their own connection with
// createRedisConnection({ maxRetriesPerRequest: null }).
export const redis = createRedisConnection({
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

export const connectRedis = async () => {
  if (redis.status === 'wait') await redis.connect();
  await redis.ping();
};

export const disconnectRedis = async () => {
  if (redis.status !== 'end') await redis.quit();
};
