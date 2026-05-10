import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Create a database connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Create the Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool)

// Instantiate Prisma Client with the adapter
const prisma = new PrismaClient({ adapter })

export default prisma
