import postgres from 'postgres'

// postgresql
const pgSql = postgres(process.env.POSTGRES_URL)

export { pgSql }
