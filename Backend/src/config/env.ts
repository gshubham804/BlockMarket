import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  ETHGAS_API_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:')
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`)
    })
    console.error('\n💡 Please check your .env file and ensure all required variables are set.')
    console.error('💡 You can copy .env.example to .env as a starting point.')
  } else {
    console.error('❌ Error loading environment variables:', error)
  }
  process.exit(1)
}

export default env
