import postgres from 'postgres'

export const pgSql = process.env.POSTGRES_URL
   ? postgres(process.env.POSTGRES_URL)
   : null
