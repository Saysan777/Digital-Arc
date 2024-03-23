
import { appRouter } from "@/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

// We did getRequestHanlder in nextjs self hosting settings in nextjs-utils files.
// Middelware in server.js will redirect the api request to nextjs and then this will handle, the request
const handler = (req: Request) => {
    fetchRequestHandler({
        endpoint: '/api/trpc/',
        req,
        router: appRouter,
        createContext: () => ({}),
    })
}

export { handler as GET, handler as POST }