
import { authRouter } from "./endpoints/auth-route";
import { router } from "./server-trpc";

// creating api using trpc.
export const appRouter = router({
    auth: authRouter
});

export type AppRouter = typeof appRouter;