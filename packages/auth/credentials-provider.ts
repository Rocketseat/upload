import { db } from '@nivo/drizzle'
import CredentialsProvider from 'next-auth/providers/credentials'

export const credentialsProvider = CredentialsProvider({
  credentials: {
    email: {
      label: 'E-mail',
      type: 'email',
      placeholder: 'use admin@rocketseat.team',
      value: 'admin@rocketseat.team',
    },
    password: {
      label: 'Password',
      type: 'password',
      value: 'admin',
      placeholder: 'use 123456',
    },
  },
  async authorize(credentials) {
    if (
      credentials?.email === 'admin@rocketseat.team' &&
      credentials.password === '123456'
    ) {
      console.log(credentials)

      const user = await db.query.user.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, 'admin@rocketseat.team')
        },
      })

      return user ?? null
    }

    throw new Error('Unauthorized.')
  },
})
