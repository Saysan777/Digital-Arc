
import { appRouter } from "@/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

// We did getRequestHandler in nextjs self hosting settings in nextjs-utils files.
// Middleware in server.js will redirect the api request to nextjs and then this will handle, the request
const handler = (req: Request) => {
    fetchRequestHandler({
        endpoint: '/api/trpc/',
        req,
        router: appRouter,
        // @ts-expect-error context already passed from express middleware
        createContext: () => ({}),
    })
}

export { handler as GET, handler as POST }
