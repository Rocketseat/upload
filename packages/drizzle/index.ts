import { neon } from '@neondatabase/serverless'
import { env } from '@nivo/env'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

const client = neon(env.DATABASE_URL)
export const db = drizzle(client, { schema })
