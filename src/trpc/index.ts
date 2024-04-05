
import { z } from "zod";
import { authRouter } from "./endpoints/auth-router";
import { publicProcedure, router } from "./server-trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";

// creating api using trpc.
export const appRouter = router({
    auth: authRouter,

    getInfiniteProducts: publicProcedure.input(z.object({ 
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator
    })).query(async ({ input })=> {
        const { query, cursor } = input;
        const { sort, limit, ...queryOpts } = query;

        const parsedQueryOpts: Record<string, { equals: string }> = {}
        
        // Parsing the queryopts input to mongoddb or payload db query format.
        Object.entries(queryOpts).forEach(([ key, value ])=> {
            parsedQueryOpts[ key ] = { equals: value }
        });
        
        const page = cursor || 1;

        const payload = await getPayloadClient();

        const { docs: items, hasNextPage, nextPage } = await payload.find({
            collection: 'products',
            where: {
                approvedForSale: {
                    equals: 'approved',
                },
                ...parsedQueryOpts
            },
            sort,
            depth: 1,
            limit,
            page,
        });

        return {
            items,
            nextPage: hasNextPage ? nextPage : null
        }
    })
});

export type AppRouter = typeof appRouter;