import { User } from "@/payload-types";
import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { PayloadRequest } from "payload/types";

const t = initTRPC.context<ExpressContext>().create();
export const router = t.router;

const middleware = t.middleware;

// TODO: Create a new middleware file and warp it in a function. Call it here and store its value in variable. Use the vairable value to make procedure private.
const isAuth = middleware(async ({ ctx, next })=> {
    const req = ctx.req as PayloadRequest;

    const { user } = req as { user: User | null }

    if(!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' }) 

    return next({
        ctx: {
            user
        },
    })
})

export const publicProcedure = t.procedure; // api using this procedure can be called anytime from client
export const privateProcedure = t.procedure.use(isAuth);    // this can be only called when isAuth is present. (We can create middleware as per our need)
