import { createTRPCProxyClient } from "@trpc/client";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    test: publicProcedure.query(() => "hello"),
});

export type AppRouter = typeof appRouter;