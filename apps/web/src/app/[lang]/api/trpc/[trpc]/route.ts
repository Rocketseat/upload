import { auth } from '@nivo/auth'
import { appRouter } from '@nivo/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  try {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: async () => {
        const session = await auth()

        return {
          session,
        }
      },
      onError: ({ error }) => {
        console.error('Error:', error)

        if (error.code === 'INTERNAL_SERVER_ERROR') {
          // TODO: send to bug reporting
        }
      },
    })

    return new NextResponse(response.body, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    })
  } catch (err) {
    console.error(err)
  }
}

export const runtime = 'edge'
export const preferredRegion = 'cle1'
export { handler as GET, handler as POST }
