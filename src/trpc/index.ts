
import { createTRPCProxyClient } from "@trpc/client";
import { publicProcedure, router } from "./server-trpc";

// creating api using trpc.
export const appRouter = router({
    testingApiFromBackend: publicProcedure.query(() => "hello"),
});

export type AppRouter = typeof appRouter;