import Redis from 'ioredis'
import postgres from 'postgres'

// redis
const redis = new Redis(process.env.REDIS_URL)

// postgresql
const pgSql = postgres(process.env.POSTGRES_URL)

export { redis, pgSql }
